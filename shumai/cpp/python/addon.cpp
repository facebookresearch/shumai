#include <node_api.h>
#include <memory>
#include <sstream>
#include <iostream>
#ifndef WIN32
#include <dlfcn.h>
#endif
#include "cpyobject.h"
#include "pyinterpreter.h"

#define DECLARE_NAPI_METHOD(name, func) { name, 0, func, 0, 0, 0, napi_default, 0 }
#define CHECK(func) { if (func != napi_ok) { napi_throw_error(env, "error", #func); return; } }
#define CHECKNULL(func) { if (func != napi_ok) { napi_throw_error(env, "error", #func); return nullptr; } }

namespace nodecallspython
{
    struct BaseTask
    {
        napi_async_work m_work;
        napi_ref m_callback;
        PyInterpreter* m_py;
        napi_env m_env;
        std::string m_error;

        ~BaseTask()
        {
            napi_delete_reference(m_env, m_callback);
            napi_delete_async_work(m_env, m_work);
        }
    };

    struct ImportTask : public BaseTask
    {
        std::string m_name;
        std::string m_handler;
    };

    struct CallTask : public BaseTask
    {
        std::string m_handler;
        std::string m_func;
        bool m_isFunc;
        CPyObject m_args;

        CPyObject m_result;

        ~CallTask()
        {
            GIL gil;
            m_args = CPyObject();
            m_result = CPyObject();
        }
    };

    struct ExecTask : public BaseTask
    {
        std::string m_handler;
        std::string m_code;
        bool m_eval;

        CPyObject m_result;

        ~ExecTask()
        {
            GIL gil;
            m_result = CPyObject();
        }
    };

    class Handler
    {
        PyInterpreter* m_py;
        std::string m_handler;
    
    public:
        Handler(PyInterpreter* py, const std::string& handler) : m_py(py), m_handler(handler) {}

        ~Handler()
        {
            GIL gil;
            m_py->release(m_handler);
        }

        static void Destructor(napi_env env, void* nativeObject, void* finalize_hint)
        {
            delete reinterpret_cast<Handler*>(nativeObject);
        }
    };

    napi_value createHandler(napi_env env, PyInterpreter* py, const std::string& stringhandler)
    {
        napi_value key;
        CHECKNULL(napi_create_string_utf8(env, "handler", NAPI_AUTO_LENGTH, &key));

        napi_value handler;
        CHECKNULL(napi_create_string_utf8(env, stringhandler.c_str(), NAPI_AUTO_LENGTH, &handler));

        napi_value result;
        CHECKNULL(napi_create_object(env, &result));

        CHECKNULL(napi_set_property(env, result, key, handler));

        CHECKNULL(napi_add_finalizer(env, result, new Handler(py, stringhandler), Handler::Destructor, nullptr, nullptr));

        return result;
    }

    template<class T>
    napi_value createHandler(napi_env env, T* task)
    {
        return createHandler(env, task->m_py, task->m_handler);
    }

    static void CallAsync(napi_env env, void* data)
    {
        auto task = static_cast<CallTask*>(data);
        GIL gil;
        try
        {
            if (task->m_isFunc)
                task->m_result = task->m_py->call(task->m_handler, task->m_func, task->m_args);
            else
                task->m_handler = task->m_py->create(task->m_handler, task->m_func, task->m_args);
        }
        catch(const std::exception& e)
        {
            task->m_error = e.what();
        }
    }

    static void ExecAsync(napi_env env, void* data)
    {
        auto task = static_cast<ExecTask*>(data);
        GIL gil;
        try
        {
            task->m_result = task->m_py->exec(task->m_handler, task->m_code, task->m_eval);
        }
        catch(const std::exception& e)
        {
            task->m_error = e.what();
        }
    }

    static void ImportAsync(napi_env env, void* data)
    {
        auto task = static_cast<ImportTask*>(data);
        GIL gil;
        try
        {
            task->m_handler = task->m_py->import(task->m_name);
        } catch(const std::exception& e)
        {
            task->m_error = e.what();
        }
    }

    void handleError(napi_env env, const BaseTask& task)
    {
        napi_value undefined;
        CHECK(napi_get_undefined(env, &undefined));

        napi_value error;
        const std::string unknownError("Unknown python error");
        CHECK(napi_create_string_utf8(env, task.m_error.empty() ? unknownError.c_str() : task.m_error.c_str(), NAPI_AUTO_LENGTH, &error));

        napi_value args[] = {undefined, error};

        napi_value callback;
        CHECK(napi_get_reference_value(env, task.m_callback, &callback));

        napi_value global;
        CHECK(napi_get_global(env, &global));

        napi_value result;
        CHECK(napi_call_function(env, global, callback, 2, args, &result));
    }

    static void ImportComplete(napi_env env, napi_status status, void* data)
    {
        std::unique_ptr<ImportTask> task(static_cast<ImportTask*>(data));
        task->m_env = env;

        if (!task->m_error.empty())
            handleError(env, *task);
        else
        {
            napi_value global;
            CHECK(napi_get_global(env, &global));

            auto handler = createHandler(env, task.get());

            napi_value callback;
            CHECK(napi_get_reference_value(env, task->m_callback, &callback));

            napi_value result;
            CHECK(napi_call_function(env, global, callback, 1, &handler, &result));
        }
    }

    static void CallComplete(napi_env env, napi_status status, void* data)
    {
        std::unique_ptr<CallTask> task(static_cast<CallTask*>(data));
        task->m_env = env;

        if (!task->m_error.empty())
            handleError(env, *task);
        else
        {
            napi_value global;
            CHECK(napi_get_global(env, &global));

            napi_value args;
            if (task->m_isFunc)
            {
                GIL gil;
                args = task->m_py->convert(env, *task->m_result);
            }
            else
            {
                args = createHandler(env, task.get());
            }

            napi_value callback;
            CHECK(napi_get_reference_value(env, task->m_callback, &callback));

            napi_value result;
            CHECK(napi_call_function(env, global, callback, 1, &args, &result));
        }
    }

    static void ExecComplete(napi_env env, napi_status status, void* data)
    {
        std::unique_ptr<ExecTask> task(static_cast<ExecTask*>(data));
        task->m_env = env;

        if (!task->m_error.empty())
            handleError(env, *task);
        else
        {
            napi_value global;
            CHECK(napi_get_global(env, &global));

            napi_value args;
            GIL gil;
            args = task->m_py->convert(env, *task->m_result);

            napi_value callback;
            CHECK(napi_get_reference_value(env, task->m_callback, &callback));

            napi_value result;
            CHECK(napi_call_function(env, global, callback, 1, &args, &result));
        }
    }
    
    class Python
    {
        napi_env m_env;
        napi_ref m_wrapper;
        static napi_ref constructor;

    public:
        static napi_value Init(napi_env env, napi_value exports)
        {
            napi_property_descriptor properties[] = 
            {
                DECLARE_NAPI_METHOD("import", import),
                DECLARE_NAPI_METHOD("importSync", importSync),
                DECLARE_NAPI_METHOD("call", call),
                DECLARE_NAPI_METHOD("callSync", callSync),
                DECLARE_NAPI_METHOD("create", newClass),
                DECLARE_NAPI_METHOD("createSync", newClassSync),
                DECLARE_NAPI_METHOD("fixlink", fixlink),
                DECLARE_NAPI_METHOD("exec", exec),
                DECLARE_NAPI_METHOD("execSync", execSync),
                DECLARE_NAPI_METHOD("eval", eval),
                DECLARE_NAPI_METHOD("evalSync", evalSync),
                DECLARE_NAPI_METHOD("addImportPath", addImportPath)
            };

            napi_value cons;
            CHECKNULL(napi_define_class(env, "PyInterpreter", NAPI_AUTO_LENGTH, create, nullptr, 12, properties, &cons));

            CHECKNULL(napi_create_reference(env, cons, 1, &constructor));

            CHECKNULL(napi_set_named_property(env, exports, "PyInterpreter", cons));

            return exports;
        }

        static void Destructor(napi_env env, void* nativeObject, void* finalize_hint)
        {
           delete reinterpret_cast<Python*>(nativeObject);
        }

        static napi_value callImpl(napi_env env, napi_callback_info info, bool isFunc, bool sync) 
        {
            try
            {
                napi_value jsthis;
                size_t argc = 100;
                napi_value args[100];
                CHECKNULL(napi_get_cb_info(env, info, &argc, &args[0], &jsthis, nullptr));

                if (argc < 2)
                {
                    napi_throw_error(env, "args", "Wrong number of arguments");
                    return nullptr;
                }

                Python* obj;
                CHECKNULL(napi_unwrap(env, jsthis, reinterpret_cast<void**>(&obj)));

                napi_valuetype handlerT;
                CHECKNULL(napi_typeof(env, args[0], &handlerT));

                napi_valuetype funcT;
                CHECKNULL(napi_typeof(env, args[1], &funcT));

                if (handlerT == napi_object && funcT == napi_string)
                {
                    napi_value key;
                    CHECKNULL(napi_create_string_utf8(env, "handler", NAPI_AUTO_LENGTH, &key));

                    napi_value value;
                    CHECKNULL(napi_get_property(env, args[0], key, &value));

                    auto handler = convertString(env, value);
                    auto func = convertString(env, args[1]);

                    std::vector<napi_value> napiargs;
                    napiargs.reserve(argc - 2);
                    for (auto i=2u;i<argc - (sync ? 0 : 1);++i)
                        napiargs.push_back(args[i]);

                    if (sync)
                    {
                        GIL gil;
                        auto& py = obj->getInterpreter();
                        auto args = py.convert(env, napiargs);

                        napi_value result;
                        if (isFunc)
                        {
                            auto pyres = py.call(handler, func, args);
                            if (pyres)
                                result = py.convert(env, *pyres);
                            else
                                CHECKNULL(napi_get_undefined(env, &result));
                        }
                        else
                        {
                            auto newhandler = py.create(handler, func, args);
                            result = createHandler(env, &py, newhandler);
                        }

                        return result;
                    }
                    else
                    {
                        napi_valuetype callbackT;
                        CHECKNULL(napi_typeof(env, args[argc - 1], &callbackT));

                        if (callbackT == napi_function)
                        {
                            CallTask* task = new CallTask;
                            task->m_py = &(obj->getInterpreter());

                            task->m_handler = convertString(env, value);
                            task->m_func = convertString(env, args[1]);
                            task->m_isFunc = isFunc;

                            napi_value optname;
                            napi_create_string_utf8(env, "Python::call", NAPI_AUTO_LENGTH, &optname);

                            {
                                GIL gil;
                                task->m_args = obj->getInterpreter().convert(env, napiargs);
                            }

                            CHECKNULL(napi_create_reference(env, args[argc - 1], 1, &task->m_callback));

                            CHECKNULL(napi_create_async_work(env, args[1], optname, CallAsync, CallComplete, task, &task->m_work));
                            CHECKNULL(napi_queue_async_work(env, task->m_work));
                        }
                    }
                }
                else
                {
                    napi_throw_error(env, "args", "Wrong type of arguments");
                }
            }
            catch(const std::exception& e)
            {
                napi_throw_error(env, "py", e.what());
            }

            return nullptr;
        }

        static napi_value execImpl(napi_env env, napi_callback_info info, bool eval, bool sync)
        {
            try
            {
                napi_value jsthis;
                size_t argc = 3;
                napi_value args[3];
                CHECKNULL(napi_get_cb_info(env, info, &argc, &args[0], &jsthis, nullptr));

                if (argc < 2)
                {
                    napi_throw_error(env, "args", "Wrong number of arguments");
                    return nullptr;
                }

                Python* obj;
                CHECKNULL(napi_unwrap(env, jsthis, reinterpret_cast<void**>(&obj)));

                napi_valuetype handlerT;
                CHECKNULL(napi_typeof(env, args[0], &handlerT));

                napi_valuetype codeToExecT;
                CHECKNULL(napi_typeof(env, args[1], &codeToExecT));

                if (handlerT == napi_object && codeToExecT == napi_string)
                {
                    napi_value key;
                    CHECKNULL(napi_create_string_utf8(env, "handler", NAPI_AUTO_LENGTH, &key));

                    napi_value value;
                    CHECKNULL(napi_get_property(env, args[0], key, &value));

                    if (sync)
                    {
                        GIL gil;
                        auto& py = obj->getInterpreter();
                        auto pyres = py.exec(convertString(env, value), convertString(env, args[1]), eval);
                        napi_value result;
                        if (pyres)
                            result = py.convert(env, *pyres);
                        else
                            CHECKNULL(napi_get_undefined(env, &result));
                        return result;
                    }
                    else
                    {
                        napi_valuetype callbackT;
                        CHECKNULL(napi_typeof(env, args[argc - 1], &callbackT));

                        if (callbackT == napi_function)
                        {
                            ExecTask* task = new ExecTask;
                            task->m_py = &(obj->getInterpreter());

                            task->m_handler = convertString(env, value);
                            task->m_code = convertString(env, args[1]);
                            task->m_eval = eval;

                            napi_value optname;
                            napi_create_string_utf8(env, "Python::exec", NAPI_AUTO_LENGTH, &optname);

                            CHECKNULL(napi_create_reference(env, args[argc - 1], 1, &task->m_callback));

                            CHECKNULL(napi_create_async_work(env, args[1], optname, ExecAsync, ExecComplete, task, &task->m_work));
                            CHECKNULL(napi_queue_async_work(env, task->m_work));
                        }
                    }
                }
                else
                {
                    napi_throw_error(env, "args", "Wrong type of arguments");
                }
            }
            catch(const std::exception& e)
            {
                napi_throw_error(env, "py", e.what());
            }

            return nullptr;
        }

        static napi_value importImpl(napi_env env, napi_callback_info info, bool sync) 
        {
            try
            {
                napi_value jsthis;
                size_t argc = 2;
                napi_value args[2];
                CHECKNULL(napi_get_cb_info(env, info, &argc, &args[0], &jsthis, nullptr));

                if (argc != 1 && argc != 2)
                {
                    napi_throw_error(env, "args", "Wrong number of arguments");
                    return nullptr;
                }

                Python* obj;
                CHECKNULL(napi_unwrap(env, jsthis, reinterpret_cast<void**>(&obj)));

                napi_valuetype moduleT;
                CHECKNULL(napi_typeof(env, args[0], &moduleT));

                if (moduleT == napi_string)
                {
                    if (sync)
                    {
                        GIL gil;
                        auto name = convertString(env, args[0]);
                        auto& py = obj->getInterpreter();

                        auto handler = py.import(name);
                        return createHandler(env, &py, handler);
                    }
                    else
                    {
                        napi_valuetype callbackT;
                        CHECKNULL(napi_typeof(env, args[1], &callbackT));

                        if (callbackT == napi_function)
                        {
                            ImportTask* task = new ImportTask;
                            task->m_py = &(obj->getInterpreter());
                            task->m_name = convertString(env, args[0]);

                            napi_value optname;
                            napi_create_string_utf8(env, "Python::import", NAPI_AUTO_LENGTH, &optname);

                            CHECKNULL(napi_create_reference(env, args[1], 1, &task->m_callback));

                            CHECKNULL(napi_create_async_work(env, args[1], optname, ImportAsync, ImportComplete, task, &task->m_work));
                            CHECKNULL(napi_queue_async_work(env, task->m_work));
                        }
                    }
                }
                else
                {
                    napi_throw_error(env, "args", "Wrong type of arguments");
                }
            }
            catch(const std::exception& e)
            {
                napi_throw_error(env, "py", e.what());
            }

            return nullptr;
        }

    private:
        std::unique_ptr<PyInterpreter> m_py;
        
        Python(napi_env env) : m_env(env), m_wrapper(nullptr)
        {
            m_py = std::make_unique<PyInterpreter>();
        }

        ~Python()
        {
            napi_delete_reference(m_env, m_wrapper);
        }

        PyInterpreter& getInterpreter() { return *m_py; }
        
        static napi_value create(napi_env env, napi_callback_info info) 
        {
            napi_value target;
            CHECKNULL(napi_get_new_target(env, info, &target));
            auto isConstructor = target != nullptr;

            if (isConstructor) 
            {
                napi_value jsthis;
                CHECKNULL(napi_get_cb_info(env, info, nullptr, 0, &jsthis, nullptr));

                Python* obj = new Python(env);

                CHECKNULL(napi_wrap(env, jsthis, reinterpret_cast<void*>(obj), Python::Destructor, nullptr, &obj->m_wrapper));

                return jsthis;
            } 
            else 
            {
                napi_value jsthis;
                CHECKNULL(napi_get_cb_info(env, info, nullptr, 0, &jsthis, nullptr));

                napi_value cons;
                CHECKNULL(napi_get_reference_value(env, constructor, &cons));

                napi_value instance;
                CHECKNULL(napi_new_instance(env, cons, 0, nullptr, &instance));

                return instance;
            }
        }

        static std::string convertString(napi_env env, napi_value value)
        {
            size_t length = 0;
            napi_get_value_string_utf8(env, value, NULL, 0, &length);
            std::string result(length, ' ');
            napi_get_value_string_utf8(env, value, &result[0], length + 1, &length);
            return result;
        }

        static napi_value import(napi_env env, napi_callback_info info) 
        {
            return importImpl(env, info, false); 
        }

        static napi_value importSync(napi_env env, napi_callback_info info) 
        {
            return importImpl(env, info, true); 
        }

        static napi_value call(napi_env env, napi_callback_info info) 
        {
            return callImpl(env, info, true, false); 
        }

        static napi_value callSync(napi_env env, napi_callback_info info) 
        {
            return callImpl(env, info, true, true); 
        }

        static napi_value exec(napi_env env, napi_callback_info info)
        {
            return execImpl(env, info, false, false);
        }

        static napi_value execSync(napi_env env, napi_callback_info info)
        {
            return execImpl(env, info, false, true);
        }

        static napi_value eval(napi_env env, napi_callback_info info)
        {
            return execImpl(env, info, true, false);
        }

        static napi_value evalSync(napi_env env, napi_callback_info info)
        {
            return execImpl(env, info, true, true);
        }

        static napi_value newClass(napi_env env, napi_callback_info info) 
        {
            return callImpl(env, info, false, false); 
        }

        static napi_value newClassSync(napi_env env, napi_callback_info info) 
        {
            return callImpl(env, info, false, true); 
        }

        static napi_value fixlink(napi_env env, napi_callback_info info)
        {
#ifdef WIN32
            return nullptr;
#else
            napi_value jsthis;
            size_t argc = 1;
            napi_value args[1];
            CHECKNULL(napi_get_cb_info(env, info, &argc, &args[0], &jsthis, nullptr));

            if (argc != 1)
            {
                napi_throw_error(env, "args", "Must have 1 arguments");
                return nullptr;
            }

            Python* obj;
            CHECKNULL(napi_unwrap(env, jsthis, reinterpret_cast<void**>(&obj)));

            napi_valuetype valuetype;
            CHECKNULL(napi_typeof(env, args[0], &valuetype));

            if (valuetype == napi_string)
            {
                auto filename = convertString(env, args[0]);
                auto result = dlopen(filename.c_str(), RTLD_LAZY | RTLD_GLOBAL);
                if (!result)
                {
                    auto error = dlerror();
                    if (error)
                        napi_throw_error(env, "args", error);
                    else
                        napi_throw_error(env, "args", "Unknown error of dlopen");
                }
                
                return nullptr;
            }
            else
            {
                napi_throw_error(env, "args", "Wrong type of arguments");
            }

            return nullptr;
#endif
        }

        static napi_value addImportPath(napi_env env, napi_callback_info info)
        {
            napi_value jsthis;
            size_t argc = 1;
            napi_value args[1];
            CHECKNULL(napi_get_cb_info(env, info, &argc, &args[0], &jsthis, nullptr));

            if (argc != 1)
            {
                napi_throw_error(env, "args", "Must have 1 arguments");
                return nullptr;
            }

            Python* obj;
            CHECKNULL(napi_unwrap(env, jsthis, reinterpret_cast<void**>(&obj)));

            napi_valuetype valuetype;
            CHECKNULL(napi_typeof(env, args[0], &valuetype));

            if (valuetype == napi_string)
            {
                auto path = convertString(env, args[0]);
                auto& py = obj->getInterpreter();

                std::string handler;
                try
                {
                    GIL gil;
                    py.addImportPath(path);
                    return nullptr;
                }
                catch(const std::exception& e)
                {
                    napi_throw_error(env, "py", e.what());
                }
            }
            else
            {
                napi_throw_error(env, "args", "Wrong type of arguments");
            }

            return nullptr;
        }
    };

    napi_ref Python::constructor;
}

NAPI_MODULE_INIT()
{
    return nodecallspython::Python::Init(env, exports);
}
