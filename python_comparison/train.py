import torch
from torch import nn
import time

iters = 10000
N = 32
hidden = 32
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

x = torch.randn(N, 1).to(device)
y = x * 4


class M(nn.Module):
    def __init__(self):
        super().__init__()
        self.layers = nn.ModuleList(
            [nn.Linear(1, hidden), nn.Linear(hidden, hidden), nn.Linear(hidden, 1)]
        )

    def forward(self, x):
        for i, l in enumerate(self.layers):
            x = l(x)
            if i != len(self.layers) - 1:
                x = nn.functional.relu(x)
        return x


loss = nn.MSELoss()
m = M().to(device)
lr = 1e-3
def optimize(params):
    for param in params:
        delta = param.grad.data.detach() * -lr
        param.data = param.data.detach() + delta
        param.requires_grad = True
def zg(params):
    for param in params:
        param.grad = None
l = None
def step():
    global l
    zg(m.parameters())
    y_hat = m(x)
    l = loss(y, y_hat)
    l.backward()
    optimize(m.parameters())
t0 = time.time()
for i in range(iters):
    step()
print("train at", iters/(time.time() - t0), "iters/sec")
print("final loss", l.item())

