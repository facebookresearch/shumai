# Distributed Training in Shumai

To try this example, run all three servers (`model.ts`, `model_a.ts`, `model_b.ts`) at once in a separate shell with this command:
```
$ bash examples/distributed/serve.sh
```

Then, in another shell, run the client (which feeds data to the model):

```
$ bun examples/distributed/data.ts
100% 200/200
3.931849241256714 x + -6.879758358001709
```

Thats' it!  We can query the statistics and parse them with `jq`:
```
$ curl -s localhost:3000/statistics | jq '"\(.m.weight) x + \(.b.weight)"'
"3.931849241256714 x + -6.879758358001709"
```


### Servers


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

