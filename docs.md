
Welcome to the Shumai docs!  To get started, install Shumai:

```bash
bun add @shumai/shumai
```

Then, in a new TypeScript file:

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

What about gradients?

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

