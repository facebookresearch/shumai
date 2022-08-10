import time

t0 = time.time()


def fib(n):
    if n == 1 or n == 0:
        return 1
    return fib(n - 1) + fib(n - 2)


N = 35
out = fib(N)

print(time.time() - t0, "seconds")
