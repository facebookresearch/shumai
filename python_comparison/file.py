import time

t0 = time.time()
with open("input.txt", "r") as f:
    out = []
    for line in f.read().strip().split("\n"):
        a, b, c = [float(x) for x in line.split(",")]
        n = a * b + c
        if len(out) and out[-1] > n:
            out.append(n - out[-1])
        out.append(n)
    print(time.time() - t0, "seconds")
