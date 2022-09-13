# Distributed in Shumai


### Servers

In three different shells, kick off the model servers:
```
$ bun model_a.ts
$ bun model_b.ts
$ bun model.ts
```

`model_a` is a parameterized multiplication (by `m`):

```
m = sm.scalar(0)
m.requires_grad = true
model = (X) => { return m.mul(X) }
```

`model_b` is a parameterized addition (by `b`):

```
b = sm.scalar(0)
b.requires_grad = true
model = (X) => { return b.mul(X) }
```

The file `model.ts` combines these two and serves up the result on port `3000`.

### Client

The client (`data.ts`) will only be communicating on port `3000`.  It has no understanding of the underlying models.
All it does it generate examples and calculate the loss between the output of `model.ts` and the expected output. 
The models never see the actual loss function nor the examples themselves.

We generate examples of the form mx + b.  We hardcode m to be 4 and b to be -7. Eventually we hope the loss to go down and the learned values of `m` and `b` (which are on two different servers) to converge to the hardcoded values.

Run the client with `bun data.ts`:

![Screen Recording 2022-09-13 at 2 53 59 PM](https://user-images.githubusercontent.com/4842908/189988722-5fc2bc77-ff80-4d2d-8738-f868f5b7eaf7.gif)

