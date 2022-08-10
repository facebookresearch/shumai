import * as ffi from "bun:ffi"
const link = ffi.dlopen("libjs_binding.dylib", {
  no_op: {},
  int_mul: {
    args: [ffi.FFIType.i32, ffi.FFIType.i32],
    returns: ffi.FFIType.i32
  }
})
const lib = link.symbols


function mul() {
  const N = 1e7
  for (let i = 0; i < N; ++i) {
    lib.int_mul(i, i)
  }
}

function noop() {
  const N = 1e8
  for (let i = 0; i < N; ++i) {
    lib.no_op();
  }
}

function wrapped_noop() {
  const f = (x) => {
    lib.no_op()
  };
  const N = 1e8
  for (let i = 0; i < N; ++i) {
    f(i);
  }
}

const t0 = performance.now()

if (process.argv.length > 2 && process.argv[2] === "noop") {
  noop();
} else if (process.argv.length > 2 && process.argv[2] === "wrapped_noop") {
  wrapped_noop();
} else {
  mul();
}



console.log((performance.now() - t0) / 1e3, "seconds");