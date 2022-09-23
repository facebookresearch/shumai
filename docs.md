Welcome to the Shumai docs!  To get started, install Shumai:

```bash
bun add @shumai/shumai
```

You may also need to [install `arrayfire`](https://github.com/arrayfire/arrayfire/wiki/Getting-ArrayFire):

```bash
brew install arrayfire
# sudo apt install arrayfire-cuda3-cuda-11-6
```

### Where to start?

If you're looking to play around and get ramped up quickly, follow along with the examples below!

<br>

#### N-dimensional Math

Shumai has various standard arithmetic utilities. Often, there are both static and method based versions of the same functions.

```javascript
import * as sm from '@shumai/shumai'

// There are various ways to create tensors
const a = sm.randn([128, 4]) // random normal tensor of size 128x4
const b = sm.scalar(1337)    // from a single value
const c = sm.tensor(new Float32Array([1, 2, 3, 4])) // from a native array

// do math! if you have a GPU, it will be used
const d = a.mul(b).add(c)

// grab the contents of d
const shape = d.shape
const data = d.toFloat32Array()

console.log(shape)
console.log(data[4]) // 4th element of the flattened array
```

<br>

#### Gradients galore!

Many arithmetic operations can have their gradients automatically calculated.  The {@link Tensor.backward} function returns a map of Tensors to gradients as well as populates all the differentiated Tensors with a `.grad` attribute.

```javascript
const W = sm.randn([128, 128])
W.requires_grad = true // or use functional `tensor.requireGrad()` method

const X = sm.randn([128, 128])
const loss = sm.loss.mse(X, W)

// backward returns a list of differentiated tensors
const ts = loss.backward()
// we can optimize these tensors in place!
sm.optim.sgd(ts, 1e-2)

// gradients are also accessible from the original tensors
const delta = W.grad.mul(sm.scalar(-1e2))

// use `detach` to copy W without tracking gradients
const Y = W.detach()
Y.sum().backward() // nothing changes
```
<br>

#### Networked Tensors

Shumai comes with a plethora of network oriented utilities.

In a server file:
```javascript
const W = sm.rand([128, 128]).requireGrad()

function my_model(x) {
  return sm.matmul(x, W)
}

sm.io.serve_model(my_model, sm.optim.sgd) // we'll immediately use sgd on backprop
```

Then, in a client:

```javascript
const model = sm.io.remote_model('0.0.0.0:3000')
for (const i of sm.util.viter(300)) {
  const input = sm.randn([1, 128])
  const out_ref = input // we'll learn the identity matrix

  const out = await model(input) // network call, have to await
  const l = sm.loss.mse(out, out_ref)
  await l.backward() // another network call, this time with autograd!
}
```

For a detailed walk-through of lower-level primitives, see the {@link io | io namespace }.
