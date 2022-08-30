import time

t0 = time.time()

N = 1024 * 1024 * 8
# let python cheat a bit with built ins
arr = list(range(N))
# scan and then sum
for i in range(1, len(arr)):
    arr[i] = arr[i - 1] + arr[i]
total = 0
for i in range(len(arr)):
    total += arr[i]
print(time.time() - t0, "seconds")
