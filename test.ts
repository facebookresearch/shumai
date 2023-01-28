import * as sm from '@shumai/shumai'

const m = sm.import('test_file')
console.log(m.foo(4, 5)) // 9

const a = sm.full([2, 2], 7)
const b = sm.full([2, 2], 8)

const c = m.foo(a, b).sum()
console.log(c.toFloat32()) // 60

const d = m.bleh(a, b).sum()
console.log(d.toFloat32()) // 224

