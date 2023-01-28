#pragma once
#include <Python.h>

namespace nodecallspython
{
    class CPyObject
    {
    private:
        PyObject* m_py;
    public:
        CPyObject() : m_py(nullptr) {}

        CPyObject(PyObject* py) : m_py(py) {}

        ~CPyObject()
        {
            if (m_py)
                Py_DECREF(m_py);
        }

        PyObject* operator*()
        {
            return m_py;
        }

        operator bool()
        {
            return m_py ? true : false;
        }

        CPyObject(const CPyObject& other)
        {
            m_py = other.m_py;
            
            if (m_py)
                Py_INCREF(m_py);
        }

        void operator=(const CPyObject& other)
        {
            if (m_py)
                Py_DECREF(m_py);

            m_py = other.m_py;
            
            if (m_py)
                Py_INCREF(m_py);
        }
    };
}
