import textwrap
import sys

if len(sys.argv) < 2:
    print("usage: python gen_binding.py (js|js_methods|c|ffi|docs)")
    exit(1)

methods_only = False
if sys.argv[1] == "js_methods":
    methods_only = True

grad_impls = {
    "add": """\
  (grad) => {
    return grad.grad_in;
  }
""",
    "sub": """\
  (grad) => {
    if (grad.idx) {
      return grad.grad_in.negative();
    }
    return grad.grad_in;
  }
""",
    "mul": """\
  (grad) => {
    return grad.in[1 - grad.idx].mul(grad.grad_in);
  }
""",
    "div": """\
  (grad) => {
    const T = grad.in[0].constructor;
    const one = new T(new Float32Array([1]));
    const recip = one.div(grad.in[1]);
    const go = grad.grad_in.mul(recip);
    if (grad.idx === 0) {
        return go;
    } else if (grad.idx === 1) {
        return go.negate().mul(recip);
    }
  }
""",
    "sum": """\
  (grad) => {
    return grad.grad_in.tile(grad.in[0].shape);
  }
""",
    "mean": """\
  (grad) => {
    const T = grad.in[0].constructor;
    const num = new T(new Float32Array([grad.in[0].elements]));
    return grad.grad_in.tile(grad.in[0].shape).div(num);
  }
""",
    "maximum": """\
  (grad) => {
    const a_idx = grad.idx;
    const b_idx = 1 - grad.idx;
    const mask = grad.in[a_idx].greaterThan(grad.in[b_idx]);
    return mask.mul(grad.grad_in);
  }
""",
    "matmul": """\
  (grad) => {
    if (grad.idx === 0) {
      const yT = grad.in[1].transpose([1,0]);
      return grad.grad_in.matmul(yT);
    } else if (grad.idx === 1) {
      const xT = grad.in[0].transpose([1,0]);
      return xT.matmul(grad.grad_in);
    }
  }
""",
}

coercion_rules = {
    "bool": "(!!{x})",
    "float": "Math.fround({x})",
    "double": "({x} + 0.00000000000001 - 0.00000000000001)",
    "int": "({x} | 0)",
    "uint32_t": "({x} <= 0 ? 0 : {x} >= 0xffffffff ? 0xffffffff : +{x} || 0)",
    "int64_t": "({x}.constructor === BigInt ? {x} : BigInt({x} || 0))",
}

op_list = [
    ("rand", ["Shape"], "Tensor"),
    ("randn", ["Shape"], "Tensor"),
    ("full", ["Shape", ("float", "val")], "Tensor"),
    ("identity", [("int64_t", "dim")], "Tensor"),
    (
        "arange",
        [("float", "start"), ("float", "end"), ("float", "step", "1")],
        "Tensor",
    ),
    ("iota", [("Shape", "dims"), ("Shape", "tileDims", "[1]")], "Tensor"),
    ("reshape", [("Tensor", "tensor"), "Shape"], "Tensor"),
    ("transpose", [("Tensor", "tensor"), ("Shape", "axes")], "Tensor"),
    ("tile", [("Tensor", "tensor"), "Shape"], "Tensor"),
    # ("concatenate", ["TensorVector", ("uint32_t", "axis")], "Tensor"),
    ("nonzero", [("Tensor", "tensor")], "Tensor"),
    # ("pad", [("Tensor", "tensor"), "PairVector"], "Tensor"),
    ("negative", ["Tensor"], "Tensor"),
    ("logicalNot", ["Tensor"], "Tensor"),
    ("exp", ["Tensor"], "Tensor"),
    ("log", ["Tensor"], "Tensor"),
    ("log1p", ["Tensor"], "Tensor"),
    ("sin", ["Tensor"], "Tensor"),
    ("cos", ["Tensor"], "Tensor"),
    ("sqrt", ["Tensor"], "Tensor"),
    ("tanh", ["Tensor"], "Tensor"),
    ("floor", ["Tensor"], "Tensor"),
    ("ceil", ["Tensor"], "Tensor"),
    ("rint", ["Tensor"], "Tensor"),
    ("absolute", ["Tensor"], "Tensor"),
    ("abs", ["Tensor"], "Tensor"),
    ("sigmoid", ["Tensor"], "Tensor"),
    ("erf", ["Tensor"], "Tensor"),
    ("flip", ["Tensor", ("uint32_t", "dim")], "Tensor"),
    ("clip", [("Tensor", "tensor"), ("Tensor", "low"), ("Tensor", "high")], "Tensor"),
    ("roll", ["Tensor", ("int", "shift"), ("uint32_t", "axis")], "Tensor"),
    ("isnan", ["Tensor"], "Tensor"),
    ("isinf", ["Tensor"], "Tensor"),
    ("sign", ["Tensor"], "Tensor"),
    ("tril", ["Tensor"], "Tensor"),
    ("triu", ["Tensor"], "Tensor"),
    ("where", [("Tensor", "cond"), ("Tensor", "x"), ("Tensor", "y")], "Tensor"),
    # topk
    ("sort", ["Tensor", ("uint32_t", "dim")], "Tensor"),
    ("add", ["Tensor", "Tensor"], "Tensor"),
    ("sub", ["Tensor", "Tensor"], "Tensor"),
    ("mul", ["Tensor", "Tensor"], "Tensor"),
    ("div", ["Tensor", "Tensor"], "Tensor"),
    ("eq", ["Tensor", "Tensor"], "Tensor"),
    ("neq", ["Tensor", "Tensor"], "Tensor"),
    ("lessThan", ["Tensor", "Tensor"], "Tensor"),
    ("lessThanEqual", ["Tensor", "Tensor"], "Tensor"),
    ("greaterThan", ["Tensor", "Tensor"], "Tensor"),
    ("greaterThanEqual", ["Tensor", "Tensor"], "Tensor"),
    ("logicalOr", ["Tensor", "Tensor"], "Tensor"),
    ("logicalAnd", ["Tensor", "Tensor"], "Tensor"),
    ("mod", ["Tensor", "Tensor"], "Tensor"),
    ("bitwiseAnd", ["Tensor", "Tensor"], "Tensor"),
    ("bitwiseOr", ["Tensor", "Tensor"], "Tensor"),
    ("bitwiseXor", ["Tensor", "Tensor"], "Tensor"),
    ("lShift", ["Tensor", "Tensor"], "Tensor"),
    ("rShift", ["Tensor", "Tensor"], "Tensor"),
    ("minimum", ["Tensor", "Tensor"], "Tensor"),
    ("maximum", ["Tensor", "Tensor"], "Tensor"),
    ("power", ["Tensor", "Tensor"], "Tensor"),
    ("matmul", ["Tensor", "Tensor"], "Tensor"),
    (
        "amin",
        ["Tensor", ("Axes", "axes", "[]"), ("bool", "keep_dims", "false")],
        "Tensor",
    ),
    (
        "amax",
        ["Tensor", ("Axes", "axes", "[]"), ("bool", "keep_dims", "false")],
        "Tensor",
    ),
    # min
    # max
    (
        "argmin",
        ["Tensor", ("uint32_t", "axis"), ("bool", "keep_dims", "false")],
        "Tensor",
    ),
    (
        "argmax",
        ["Tensor", ("uint32_t", "axis"), ("bool", "keep_dims", "false")],
        "Tensor",
    ),
    (
        "sum",
        [("Tensor", "tensor"), ("Axes", "axes", "[]"), ("bool", "keep_dims", "false")],
        "Tensor",
    ),
    ("cumsum", [("Tensor", "tensor"), ("uint32_t", "axis")], "Tensor"),
    (
        "mean",
        [("Tensor", "tensor"), ("Axes", "axes", "[]"), ("bool", "keep_dims", "false")],
        "Tensor",
    ),
    (
        "median",
        [("Tensor", "tensor"), ("Axes", "axes", "[]"), ("bool", "keep_dims", "false")],
        "Tensor",
    ),
    (
        "var",
        [
            ("Tensor", "tensor"),
            ("Axes", "axes", "[]"),
            ("bool", "bias", "false"),
            ("bool", "keep_dims", "false"),
        ],
        "Tensor",
    ),
    (
        "std",
        [("Tensor", "tensor"), ("Axes", "axes", "[]"), ("bool", "keep_dims", "false")],
        "Tensor",
    ),
    (
        "norm",
        [
            ("Tensor", "tensor"),
            ("Axes", "axes", "[]"),
            ("double", "p", "2"),
            ("bool", "keep_dims", "false"),
        ],
        "Tensor",
    ),
    (
        "countNonzero",
        [("Tensor", "tensor"), ("Axes", "axes", "[]"), ("bool", "keep_dims", "false")],
        "Tensor",
    ),
    (
        "any",
        [("Tensor", "tensor"), ("Axes", "axes", "[]"), ("bool", "keep_dims", "false")],
        "Tensor",
    ),
    (
        "all",
        [("Tensor", "tensor"), ("Axes", "axes", "[]"), ("bool", "keep_dims", "false")],
        "Tensor",
    ),
]

to_ffi = {
    "char*": "cstring",
    "void*": "ptr",
    "int8_t": "i8",
    "int16_t": "i16",
    "int32_t": "i32",
    "int": "i32",
    "int64_t": "i64",
    "uint8_t": "u8",
    "uint16_t": "u16",
    "uint32_t": "u32",
    "uint64_t": "u64",
    "float": "f32",
    "double": "f64",
    "bool": "bool",
    "char": "char",
}

to_ts = {
    "bool": "boolean",
    "float": "number",
    "double": "number",
    "int": "number",
    "int16_t": "number",
    "int32_t": "number",
    "int64_t": "number",
    "uint16_t": "number",
    "uint32_t": "number",
    "uint64_t": "number",
    "Tensor": "Tensor",
    "Shape": "number[]",
    "Axes": "number[]",
}


def valid_js(name):
    if name == "var":
        return "_var"
    return name


full_js = []
full_js_types = []
full_js_unary = []
full_ffi = []
full_c = []
full_docs = []

for op, args, ret in op_list:
    c_sig = []
    ffi_sig = []
    js_sig = []
    js_impl = []
    js_args = []
    c_impl = []
    c_op_args = []
    t_count = 0

    def normalize_arg(arg):
        if type(arg) is tuple and len(arg) == 3:
            return arg
        elif type(arg) is tuple:
            t, n = arg
            return t, n, None
        return arg, None, None

    supports_method = normalize_arg(args[0])[0] == "Tensor"
    if methods_only:
        if not supports_method:
            continue

    for arg in args[methods_only:]:
        t, n, d = normalize_arg(arg)
        if t == "Tensor":
            if not n:
                if t_count == 0:
                    n = f"tensor"
                elif t_count == 1:
                    n = f"other"
                else:
                    n = f"other_{t_count - 1}"
                t_count += 1
            c_sig.append(f"void *{n}")
            ffi_sig.append("FFIType.ptr")
            js_args.append(f"{n}")
            c_impl.append(f"auto *{n}_ptr = reinterpret_cast<fl::Tensor*>({n});")
            c_op_args.append(f"*{n}_ptr")
        elif t == "Shape":
            if not n:
                n = "shape"
            c_sig.append(f"void *{n}_ptr")
            c_sig.append(f"int64_t {n}_len")
            c_impl.append(f"auto {n} = arrayArg<long long>({n}_ptr, {n}_len);")
            c_op_args.append(f"fl::Shape({n})")
            ffi_sig.append("FFIType.ptr")
            ffi_sig.append("FFIType.i64")
            js_impl.append(f"const [{n}_ptr, {n}_len] = arrayArg({n}, FFIType.i64);")
            js_args.append(f"{n}_ptr")
            js_args.append(f"{n}_len")
        elif t == "Axes":
            if not n:
                n = "axes"
            c_sig.append(f"void *{n}_ptr")
            c_sig.append(f"int64_t {n}_len")
            c_impl.append(f"auto {n} = arrayArg<int>({n}_ptr, {n}_len);")
            c_op_args.append(f"{n}")
            ffi_sig.append("FFIType.ptr")
            ffi_sig.append("FFIType.i64")
            js_impl.append(f"const [{n}_ptr, {n}_len] = arrayArg({n}, FFIType.i64);")
            js_args.append(f"{n}_ptr")
            js_args.append(f"{n}_len")
        else:
            c_sig.append(f"{t} {n}")
            c_op_args.append(f"{n}")
            ffi_sig.append(f"FFIType.{to_ffi[t]}")
            js_args.append(coercion_rules[t].format(x=n))
        js_arg_type = (
            to_ts[t]
            if t != "Tensor"
            else ("TensorInterface" if methods_only else "Tensor")
        )
        if d:
            js_sig.append(n + ": " + js_arg_type + " = " + d)
        else:
            js_sig.append(n + ": " + js_arg_type)
    # TODO ret != single value
    ffi_ret = ""
    c_ret = ret
    c_args = ", ".join(c_op_args)
    if ret == "Tensor":
        c_impl.append(f"auto* t = new fl::Tensor(fl::{op}({c_args}));")
        c_impl.append(f"g_bytes_used += t->bytes();")
        c_impl.append(f"return t;")
        c_ret = "void*"
        ffi_ret = f"FFIType.{to_ffi['void*']}"
    else:
        c_impl.append(f"return fl::{op}({c_args});")
        ffi_ret = f"FFIType.{to_ffi[ret]}"

    ffi = f"""\
  _{op}: {{
    args: [{', '.join(ffi_sig)}],
    returns: {ffi_ret}
  }},"""

    js_impl_full = "\n".join(js_impl)
    js = f"""
{'export function ' if not methods_only else ''}{valid_js(op)}({', '.join(js_sig)}) {{
  {js_impl_full}
  const t = {'wrapFLTensor' if not methods_only else 'wrapFunc'}(fl._{op}.native, {', '.join((['this'] if methods_only else []) + js_args)});
  t.op = "{op}";
  t.grad_fn = {grad_impls[op] if op in grad_impls else 'null'};
  return t;
}}{',' if methods_only else ''}"""

    js = textwrap.indent(js, "    ") if methods_only else js

    c_impl_str = textwrap.indent("\n".join(c_impl), "  ")
    c = f"""
{c_ret} _{op}({', '.join(c_sig)}) {{
{c_impl_str}
}}"""
    full_js.append(js)
    full_js_types.append(f"  {op}: Function;")
    full_ffi.append(ffi)
    full_c.append(c)
    doc = f"{op} | `{op}({', '.join(js_sig)}) : {to_ts[ret]}` |"
    if supports_method:
        doc += f"`t.{op}({', '.join(js_sig[1:])}) : {to_ts[ret]}`"
    full_docs.append(doc)

if sys.argv[1] == "docs":
    print("Operation | Function | Tensor Method (`t : Tensor`)")
    print("---|---|---")
    print("\n".join(full_docs))
if sys.argv[1] == "c":
    print("\n".join(full_c))

if sys.argv[1] == "ffi":
    full_ffi = "\n".join(full_ffi)
    full_ffi = f"""\
/* GENERATED CODE (gen_binding.py) */
import {{ FFIType }} from 'bun:ffi';
let ffi_tensor_ops = {{\n{full_ffi}\n}};
export {{ ffi_tensor_ops }};"""

    print(full_ffi)

if sys.argv[1] in ["js", "js_methods"]:
    full_js = "\n".join(full_js)
    if methods_only:
        # js_methods
        full_js = f"""\
/* GENERATED CODE (gen_binding.py) */
import {{ FFIType }} from "bun:ffi";
import {{ arrayArg }} from "../ffi/ffi_bind_utils";
import {{ fl }} from "../ffi/ffi_flashlight";
import {{ TensorInterface }} from "./tensor_interface";
export const gen_tensor_op_shim = (wrapFunc: Function) => {{
  return {{{full_js}
  }};
}}
"""
    else:
        # js
        full_js = f"""\
/* GENERATED CODE (gen_binding.py) */
import {{ FFIType }} from "bun:ffi";
import {{ arrayArg }} from "../ffi/ffi_bind_utils";
import {{ fl }} from "../ffi/ffi_flashlight";
import {{ Tensor, wrapFLTensor }} from "./tensor";
{full_js}"""
    print(full_js)

if sys.argv[1] in ["js_ops_interface", "js_ops_types"]:
    full_js_types = "\n".join(full_js_types)
    full_js_types = f"""\
/* GENERATED CODE (gen_binding.py) */
interface TensorOpsInterface {{
{full_js_types}
}}
export {{ TensorOpsInterface }};"""
    print(full_js_types)