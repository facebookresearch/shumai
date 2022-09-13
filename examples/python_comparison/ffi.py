import time
import py_binding
import sys


def mul():
    N = int(1e7)
    for i in range(N):
        py_binding.int_mul(i, i)


def noop():
    N = int(1e8)
    for i in range(N):
        py_binding.no_op()


def wrapped_noop():
    f = lambda x: py_binding.no_op()
    N = int(1e8)
    for i in range(N):
        f(i)


t0 = time.time()

if len(sys.argv) > 1 and sys.argv[1] == "noop":
    noop()
elif len(sys.argv) > 1 and sys.argv[1] == "wrapped_noop":
    wrapped_noop()
else:
    mul()

print(time.time() - t0, "seconds")
