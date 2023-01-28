#include "pyinterpreter.h"
#include "dlpack.h"
#include <sstream>
#include <iostream>
#include <csignal>
#include <cstdlib>

using namespace nodecallspython;

std::mutex nodecallspython::GIL::m_mutex;
bool nodecallspython::PyInterpreter::m_inited = false;
std::mutex nodecallspython::PyInterpreter::m_mutex;
static char dltensor_str[] = "dltensor";

namespace
{
    void signal_handler_int(int)
    {
        std::exit(130);
    }

   static inline size_t GetDataSize(const DLTensor* t) {
     size_t size = 1;
     for (int32_t i = 0; i < t->ndim; ++i) {
       size *= t->shape[i];
     }
     size *= (t->dtype.bits * t->dtype.lanes + 7) / 8;
     return size;
   }

    static const char MODULE = '@';
    static const char INSTANCE = '#';

    std::string getUUID(bool module, CPyObject& obj)
    {
        std::stringstream ss;
        ss << (module ? MODULE : INSTANCE);
        ss << "nodecallspython-";
        ss << rand() << "-";
        ss << *obj;
        return ss.str();
    }

    void handleException()
    {
        if (PyErr_Occurred())
        {
            PyErr_Print();
            //PyObject *type, *value, *traceback;
            //PyErr_Fetch(&type, &value, &traceback);

            //CPyObject error = PyObject_Str(value);
            //CPyObject trace = PyObject_Str(traceback);

            //std::string err_str;
            //if (error)
            //{
            //    Py_ssize_t size;
            //    err_str += PyUnicode_AsUTF8AndSize(*error, &size);
            //}
            //if (trace)
            //{
            //    Py_ssize_t size;
            //    err_str += PyUnicode_AsUTF8AndSize(*trace, &size);
            //}
            //std::runtime_error err(err_str.size() ? err_str : "Unknown python error");

            //PyErr_Restore(type, value, traceback);

            throw std::runtime_error("An exception occurred in Python code");
        }
    }
}

PyInterpreter::PyInterpreter() : m_state(nullptr)
{
    std::lock_guard<std::mutex> l(m_mutex);

    if (!m_inited)
    {
        Py_InitializeEx(0);

#if PY_MINOR_VERSION < 9
        if (!PyEval_ThreadsInitialized())
            PyEval_InitThreads();
#endif

        Py_DECREF(PyImport_ImportModule("threading"));

        m_state = PyEval_SaveThread();

        if (!std::getenv("NODE_CALLS_PYTHON_IGNORE_SIGINT"))
            PyOS_setsig(SIGINT, ::signal_handler_int);

        m_inited = true;
    }

}

PyInterpreter::~PyInterpreter()
{
    if (m_state)
    {
        PyEval_RestoreThread(m_state);
        m_objs = {};
        Py_Finalize();
    }
}

#define CHECK(func) { auto res = func; if (res != napi_ok) { throw std::runtime_error(std::string(#func) + " returned with an error: " + std::to_string(static_cast<int>(func))); } }

namespace
{
    PyObject* handleInteger(napi_env env, napi_value arg)
    {
        //handle integers
        int32_t i = 0;
        auto res = napi_get_value_int32(env, arg, &i);
        if (res != napi_ok)
        {
            uint32_t i = 0;
            res = napi_get_value_uint32(env, arg, &i);
            if (res != napi_ok)
            {
                int64_t i = 0;
                res = napi_get_value_int64(env, arg, &i);
                if (res == napi_ok)
                    return PyLong_FromLong(i);
                else
                    throw std::runtime_error("Invalid parameter: unknown type");
            }
            else
                return PyLong_FromLong(i);
        }
        else
            return PyLong_FromLong(i);
    }

    PyObject* convert(napi_env env, napi_value arg)
    {
        napi_valuetype type;
        CHECK(napi_typeof(env, arg, &type));

        bool isarray = false;
        CHECK(napi_is_array(env, arg, &isarray));

        if (isarray)
        {
            uint32_t length = 0;
            CHECK(napi_get_array_length(env, arg, &length));

            auto* list = PyList_New(length);

            for (auto i = 0u; i < length; ++i)
            {
                napi_value value;
                CHECK(napi_get_element(env, arg, i, &value));
                PyList_SetItem(list, i, ::convert(env, value));
            }

            return list;
        }
        else if (type == napi_undefined || type == napi_null)
        {
            Py_INCREF(Py_None);
            return Py_None;
        }
        else if (type == napi_string)
        {
            size_t length = 0;
            CHECK(napi_get_value_string_utf8(env, arg, NULL, 0, &length));
            std::string s(length, ' ');
            CHECK(napi_get_value_string_utf8(env, arg, &s[0], length + 1, &length));

            return PyUnicode_FromString(s.c_str());
        }
        else if (type == napi_number)
        {
            double d = 0.0;
            CHECK(napi_get_value_double(env, arg, &d));
            if ((double) ((int) d) == d)
                return handleInteger(env, arg);
            else
                return PyFloat_FromDouble(d);
        }
        else if (type == napi_boolean)
        {
            bool b = false;
            CHECK(napi_get_value_bool(env, arg, &b));
            return b ? PyBool_FromLong(1) : PyBool_FromLong(0);
        }
        else if (type == napi_object)
        {
            napi_value properties;
            CHECK(napi_get_property_names(env, arg, &properties));

            uint32_t length = 0;
            CHECK(napi_get_array_length(env, properties, &length));
            if (length == 1) {
                napi_value key;
                CHECK(napi_get_element(env, properties, 0, &key));
                size_t str_length = 0;
                CHECK(napi_get_value_string_utf8(env, key, NULL, 0, &str_length));
                std::string s(str_length, ' ');
                CHECK(napi_get_value_string_utf8(env, key, &s[0], str_length + 1, &str_length));
                if (s == dltensor_str) {
                  napi_value value;
                  CHECK(napi_get_property(env, arg, key, &value));
                  PyObject* dlModuleString = PyUnicode_FromString((char*)"torch");
                  PyObject* dlModule = PyImport_Import(dlModuleString);
                  if (dlModule) {
                    PyObject* convertFunc = PyObject_GetAttrString(dlModule, (char*)"from_dlpack");
                    int64_t ptr;
                    CHECK(napi_get_value_int64(env, value, &ptr));
                    auto capsule = PyCapsule_New((void*)ptr, dltensor_str, NULL);
                    PyObject* args = PyTuple_Pack(1, capsule);
                    PyObject* result = PyObject_CallObject(convertFunc, args);
                    if (result) {
                      return result;
                    } else {
                      handleException();
                    }
                  } else {
                    handleException();
                  }
                }
            }

            auto* dict = PyDict_New();

            for (auto i = 0u; i < length; ++i)
            {
                napi_value key;
                CHECK(napi_get_element(env, properties, i, &key));
                
                CPyObject pykey = ::convert(env, key);

                napi_value value;
                CHECK(napi_get_property(env, arg, key, &value));
                CPyObject pyvalue = ::convert(env, value);

                PyDict_SetItem(dict, *pykey, *pyvalue);
            }

            return dict;
        }
        else
            return handleInteger(env, arg);

        throw std::runtime_error("Invalid parameter: unknown type");
    }
}

CPyObject PyInterpreter::convert(napi_env env, const std::vector<napi_value>& args)
{
    if (args.size() == 0)
        return CPyObject();

    CPyObject params = PyTuple_New(args.size());

    for (auto i=0u;i<args.size();++i)
    {
        auto cparams = ::convert(env, args[i]);
        if (!cparams)
            throw std::runtime_error("Cannot convert #" + std::to_string(i + 1) + " argument");

        PyTuple_SetItem(*params, i, cparams);
    }
    return params;
}

namespace
{
    napi_value fillArray(napi_env env, CPyObject& iterator, napi_value array)
    {
        PyObject *item;
        auto i = 0;
        while ((item = PyIter_Next(*iterator))) 
        {
            CHECK(napi_set_element(env, array, i, PyInterpreter::convert(env, item)));
            Py_DECREF(item);
            ++i;
        }

        return array;
    }
}

napi_value PyInterpreter::convert(napi_env env, PyObject* obj)
{
    if (PyBool_Check(obj))
    {
        napi_value result;
        CHECK(napi_get_boolean(env, obj == Py_True, &result));
        return result;
    }
    else if (PyUnicode_Check(obj))
    {
        Py_ssize_t size;
        auto str = PyUnicode_AsUTF8AndSize(obj, &size);

        napi_value result;
        CHECK(napi_create_string_utf8(env, str, size, &result));
        return result;
    }
    else if (PyLong_Check(obj))
    {
        napi_value result;
        CHECK(napi_create_int64(env, PyLong_AsLong(obj), &result));
        return result;
    }
    else if (PyFloat_Check(obj))
    {
        napi_value result;
        CHECK(napi_create_double(env, PyFloat_AsDouble(obj), &result));
        return result;
    }
    else if (PyList_Check(obj))
    {
        auto length = PyList_Size(obj);
        napi_value array;
        CHECK(napi_create_array_with_length(env, length, &array));

        for (auto i = 0u; i < length; ++i)
            CHECK(napi_set_element(env, array, i, convert(env, PyList_GetItem(obj, i))));

        return array;
    }
    else if (PyTuple_Check(obj))
    {
        auto length = PyTuple_Size(obj);
        napi_value array;
        CHECK(napi_create_array_with_length(env, length, &array));

        for (auto i = 0u; i < length; ++i)
            CHECK(napi_set_element(env, array, i, convert(env, PyTuple_GetItem(obj, i))));

        return array;
    }
    else if (PySet_Check(obj))
    {
        auto length = PySet_Size(obj);
        napi_value array;
        CHECK(napi_create_array_with_length(env, length, &array));

        CPyObject iterator = PyObject_GetIter(obj);

        return fillArray(env, iterator, array);
    }
    else if (PyDict_Check(obj))
    {
        napi_value object;
        CHECK(napi_create_object(env, &object));

        PyObject *key, *value;
        Py_ssize_t pos = 0;

        while (PyDict_Next(obj, &pos, &key, &value))
            CHECK(napi_set_property(env, object, convert(env, key), convert(env, value)));

        return object;
    }
    else if (obj == Py_None)
    {
        napi_value undefined;
        CHECK(napi_get_undefined(env, &undefined));
        return undefined;
    }
    else
    {
        PyObject* type = PyObject_Type(obj);
        PyObject* dlpack = PyObject_GetAttrString(obj, "__dlpack__");
        if (dlpack) {
          PyObject* capsule = PyObject_CallNoArgs(dlpack);
          const char* name = PyCapsule_GetName(capsule);
          DLTensor* tensor = (DLTensor*)PyCapsule_GetPointer(capsule, name);
          PyCapsule_SetDestructor(capsule, NULL);
          napi_value result;
          napi_value pointer;
          CHECK(napi_create_int64(env, (int64_t)tensor, &pointer));
          CHECK(napi_create_object(env, &result));
          CHECK(napi_set_named_property(env, result, "dltensor", pointer));
          return result;
        }
        return PyInterpreter::convert(env, PyObject_Str(type));
        CPyObject iterator = PyObject_GetIter(obj);
        if (iterator)
        {
            napi_value array;
            CHECK(napi_create_array(env, &array));

            return fillArray(env, iterator, array);
        }
        else
        {
            // attempt to force convert to support numpy arrays
            PyErr_Clear();

            // cannot decide between int and double if we do not know the type here, so cast everything to double
            auto value = PyFloat_AsDouble(obj);
            if (!PyErr_Occurred())
            {
                napi_value result;
                CHECK(napi_create_double(env, value, &result));
                return result;
            }
            else
            {
                PyErr_Clear();
                Py_ssize_t size;
                auto str = PyUnicode_AsUTF8AndSize(obj, &size);
                if (str)
                {
                    napi_value result;
                    CHECK(napi_create_string_utf8(env, str, size, &result));
                    return result;
                }
                PyErr_Clear();
            }

            napi_value undefined;
            CHECK(napi_get_undefined(env, &undefined));
            return undefined;
        }
    }
}


std::string PyInterpreter::import(const std::string& modulename)
{
    auto name = modulename;
    auto pos = name.find_last_of("\\");
    if (pos == std::string::npos)
        pos =  name.find_last_of("/");

    auto globals = CPyObject{PyDict_New()};
    PyErr_Clear();
    CPyObject pyResult = PyRun_String(R"PY(
import os
import sys
paths = os.popen("python -c 'import sys;print(\":\".join(sys.path))'").read().strip().split(':')
for p in paths:
  try:
      sys.path.index(p)
  except ValueError:
      sys.path.append(p))PY", Py_file_input, *globals, *globals);
    if (pos != std::string::npos)
    {
        auto dir = name.substr(0, pos);
        name = name.substr(pos + 1);

        addImportPath(dir);
    }

    auto len = name.length();
    if (len > 2 && name[len - 3] == '.' && name[len - 2] == 'p' && name[len - 1] == 'y')
        name = name.substr(0, len - 3);
    
    PyErr_Clear();
    CPyObject pyModule = PyImport_ImportModule(name.c_str());

    if(pyModule)
    {
        auto name = getUUID(true, pyModule);
        m_objs[name] = pyModule;
        return name;
    }
    else
        handleException();
        
    return std::string();
}

CPyObject PyInterpreter::call(const std::string& handler, const std::string& func, CPyObject& args)
{
    auto it = m_objs.find(handler);

    if(it == m_objs.end())
        throw std::runtime_error("Cannot find handler: " + handler);

    PyErr_Clear();
    CPyObject pyFunc = PyObject_GetAttrString(*(it->second), func.c_str());
    if (pyFunc && PyCallable_Check(*pyFunc))
    {
        CPyObject pyResult = PyObject_CallObject(*pyFunc, *args);
        if (!*pyResult)
        {
            handleException();
            throw std::runtime_error("Unknown python error");
        }

        return pyResult;
    }
    else
        handleException();
    
    throw std::runtime_error("Unknown python error");
}

CPyObject PyInterpreter::exec(const std::string& handler, const std::string& code, bool eval)
{
    auto it = m_objs.find(handler);

    if(it == m_objs.end())
        throw std::runtime_error("Cannot find handler: " + handler);

    auto localsPtr = PyModule_GetDict(*(it->second));
    auto globals = CPyObject{PyDict_New()};

    PyErr_Clear();
    CPyObject pyResult = PyRun_String(code.c_str(), eval ? Py_eval_input : Py_file_input, *globals, localsPtr);
    if (!*pyResult)
    {
        handleException();
        throw std::runtime_error("Unknown python error");
    }

    return pyResult;
}

std::string PyInterpreter::create(const std::string& handler, const std::string& name, CPyObject& args)
{
    auto obj = call(handler, name, args);

    if (obj)
    {
        auto uuid = getUUID(false, obj);
        m_objs[uuid] = obj;
        return uuid;
    }

    return std::string();
}

void PyInterpreter::release(const std::string& handler)
{
    m_objs.erase(handler);
}

void PyInterpreter::addImportPath(const std::string& path)
{
    auto sysPath = PySys_GetObject("path");
    CPyObject dirName = PyUnicode_FromString(path.c_str());
    PyList_Insert(sysPath, 0, *dirName);
}
