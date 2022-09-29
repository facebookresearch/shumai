import torch
import time

t0 = time.time()
x = torch.randn(8, 128, 128)
for i in range(1000):
  torch.save(x, '/tmp/tensor.pt')
  x = torch.load('/tmp/tensor.pt')
t1 = time.time()
print(t1 - t0)
