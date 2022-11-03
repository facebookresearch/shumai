import textwrap
import sys
import pathlib

if len(sys.argv) < 2:
    print("usage: python gen_binding.py (js|js_methods|c|ffi)")
    exit(1)

methods_only = False
if sys.argv[1] == "js_methods":
    methods_only = True

coercion_rules = {
    "bool": "(!!{x})",
    "float": "Math.fround({x})",
    "double": "({x} + 0.00000000000001 - 0.00000000000001)",
    "int": "({x} | 0)",
    "int32_t": "({x} | 0)",
    "uint32_t": "({x} <= 0 ? 0 : {x} >= 0xffffffff ? 0xffffffff : +{x} || 0)",
    "int64_t": "({x}.constructor === BigInt ? {x} : BigInt({x} || 0))",
}

comments = {}
with open(pathlib.Path(__file__).parent.resolve() / 'ops.doc') as f:
    def js(op, lines, is_static, prefix=0):
        p = ' ' * prefix
        c = '\n'.join((p + '*   ' + x) for x in lines).strip()
        c = p + '/**\n' + p + c + '\n'+ p +'*/\n'
        c = c.rstrip()
        static_replacement = f'There is a static function version of this method: {{@link {op}}}.'
        method_replacement = f'There is a method version of this static function: {{@link Tensor.{op} | Tensor.{op} }}.'
        return c.replace('%%suggest_other%%', method_replacement if is_static else static_replacement)

    def process_comment(comment):
        lines = comment.split('\n')
        op_name = lines[0][:-1]
        base_comment = lines[1:]
        function_comment = []
        method_comment = []
        for l in base_comment:
            if l.startswith('%%static%%'):
                function_comment.append(l[len('%%static%%'):])
            else:
                function_comment.append(l)
                method_comment.append(l)

        comments[op_name] = (js(op_name, function_comment, True), js(op_name, method_comment, False, 2))
    for comment in f.read().split('---'):
        process_comment(comment.strip())

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
    ("concatenate", ["TensorVector", ("int32_t", "axis")], "Tensor"),
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
    #("abs", ["Tensor"], "Tensor"),
    ("sigmoid", ["Tensor"], "Tensor"),
    ("erf", ["Tensor"], "Tensor"),
    ("flip", ["Tensor", ("uint32_t", "dim")], "Tensor"),
    ("clip", [("Tensor", "tensor"), ("Tensor", "low"), ("Tensor", "high")], "Tensor"),
    ("roll", ["Tensor", ("int", "shift"), ("int32_t", "axis")], "Tensor"),
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
    ("conv2d", ["Tensor", ("Tensor", "weights"),
        ("int32_t", "sx", "1"), ("int32_t", "sy", "1"),
        ("int32_t", "px", "0"), ("int32_t", "py", "0"),
        ("int32_t", "dx", "1"), ("int32_t", "dy", "1"),
        ("int32_t", "groups", "1")], "Tensor"),
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
        ["Tensor", ("int32_t", "axis"), ("bool", "keep_dims", "false")],
        "Tensor",
    ),
    (
        "argmax",
        ["Tensor", ("int32_t", "axis"), ("bool", "keep_dims", "false")],
        "Tensor",
    ),
    (
        "sum",
        [("Tensor", "tensor"), ("Axes", "axes", "[]"), ("bool", "keep_dims", "false")],
        "Tensor",
    ),
    ("cumsum", [("Tensor", "tensor"), ("int32_t", "axis")], "Tensor"),
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

op_aliases = {
  "matmul": ["mm"],
  "absolute": ["abs"],
  "identity": ["ident", "eye"],
  "negative": ["negate"],
  "lessThan": ["lt"],
  "lessThanEqual": ["lte"],
  "greaterThan": ["gt"],
  "greaterThanEqual": ["gte"],
  "var": ["variance"],
  "norm": ["normalize"],
  "concatenate": ["concat"],
}

# ops that need inputs transposed to work correctly
# if g_row_major == true
reverse_args_row_major = [
  "matmul",
]

# ops that need to be replaced with another when g_row_major == true
op_overwrite_row_major = {
    "tril": "triu",
    "triu": "tril"
}

# called directly after the base case
c_overwrites = {
    "norm": lambda c_op_args: f"""
      if (p == std::numeric_limits<double>::infinity()) {{
        t = fl::abs({c_op_args[0]});
        t = fl::amax(t, {c_op_args[1]}, {c_op_args[3]});
      }}
    """
}

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
    "TensorVector": "Array<Tensor>",
    "Shape": "BigInt64Array | number[]",
    "Axes": "BigInt64Array | number[]",
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

for op, args, ret in op_list:
    c_sig = []
    ffi_sig = []
    js_sig = []
    js_sig_names = []
    ts_sig = []
    js_impl = []
    js_args = []
    js_arg_types = []
    js_tensor_args = []
    js_tensor_vector_args = []
    js_grad_args = []
    js_grad_arg_types = []
    c_impl = ["LOCK_GUARD\n"]
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
    first_tensor = None
    first_axes = None
    first_axis = None
    fix_keep_dims = False
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
            c_sig.append(f"void* {n}")
            ffi_sig.append("FFIType.ptr")
            js_args.append(f"{n}")
            js_arg_types.append(t)
            js_grad_args.append(f"{n}")
            js_grad_arg_types.append(t)
            js_tensor_args.append(f"{n}")
            c_impl.append(f"auto* {n}_ptr = reinterpret_cast<fl::Tensor*>({n});")
            if not first_tensor:
                first_tensor = f"{n}_ptr"
            if op == 'where' and n == 'cond':
                c_op_args.append(f"{n}_ptr->astype(fl::dtype::b8)")
            else:
                c_op_args.append(f"*{n}_ptr")
        elif t == "TensorVector":
            if not n:
                n = "tensors"
            c_sig.append(f"void* {n}_ptr")
            c_sig.append(f"int64_t {n}_len")
            c_impl.append(f"auto {n} = ptrArrayArg<fl::Tensor>({n}_ptr, {n}_len);")
            c_op_args.append(f"{n}")
            ffi_sig.append("FFIType.ptr")
            ffi_sig.append("FFIType.i64")
            if op == "concatenate":
                # Strange behaviour in Flashlight where concatenating scalars with negative axis fails to expand, unlike with non-scalar tensors
                js_impl.append(f"if (axis < 0) {{ for (let i = 0; i < {n}.length; ++i) {{ if ({n}[i].shape.length === 0) {{ {n}[i] = {n}[i].reshape([1]) }} }} }}")
            js_impl.append(f"const [{n}_ptr, {n}_len] = arrayArg({n});")
            js_args.append(f"{n}_ptr")
            js_args.append(f"{n}_len")
            js_arg_types.append(f"TensorVector_ptr")
            js_arg_types.append(f"TensorVector_len")
            js_grad_args.append(f"{n}")
            js_grad_arg_types.append(t)
            js_tensor_vector_args.append(f"{n}")
            if not first_tensor:
                first_tensor = f"(&{n}[0])"
        elif t == "Shape":
            if not n:
                n = "shape"
            c_sig.append(f"void* {n}_ptr")
            c_sig.append(f"int64_t {n}_len")
            if op == "transpose": # bug in flashlight
                c_impl.append(f"auto {n} = arrayArg<long long>({n}_ptr, {n}_len, g_row_major, {first_tensor}->ndim());")
            else:
                c_impl.append(f"auto {n} = arrayArg<long long>({n}_ptr, {n}_len, g_row_major, false);")
            c_op_args.append(f"fl::Shape({n})")
            ffi_sig.append("FFIType.ptr")
            ffi_sig.append("FFIType.i64")
            js_impl.append(f"const [{n}_ptr, {n}_len] = arrayArg({n});")
            js_args.append(f"{n}_ptr")
            js_args.append(f"{n}_len")
            js_arg_types.append("Shape_ptr")
            js_arg_types.append("Shape_len")
            js_grad_args.append(f"{n}")
            js_grad_arg_types.append(t)
        elif t == "Axes":
            if not n:
                n = "axes"
            first_axes = n
            c_sig.append(f"void* {n}_ptr")
            c_sig.append(f"int64_t {n}_len")
            c_impl.append(f"auto {n} = arrayArg<int>({n}_ptr, {n}_len, g_row_major, {first_tensor}->ndim());")
            c_op_args.append(f"{n}")
            ffi_sig.append("FFIType.ptr")
            ffi_sig.append("FFIType.i64")
            js_impl.append(f"const [{n}_ptr, {n}_len] = arrayArg({n});")
            js_args.append(f"{n}_ptr")
            js_args.append(f"{n}_len")
            js_arg_types.append("Axes_ptr")
            js_arg_types.append("Axes_len")
            js_grad_args.append(f"{n}")
            js_grad_arg_types.append(t)
        else:
            c_sig.append(f"{t} {n}")
            if n == "axis":
                c_impl.append(f"auto used_{n} = axisArg(axis, g_row_major, {first_tensor}->ndim());")
                c_op_args.append(f"used_axis")
                first_axis = f"static_cast<int>(used_{n})"
            else:
                c_op_args.append(f"{n}")
            if n == "keep_dims":
                fix_keep_dims = True
            ffi_sig.append(f"FFIType.{to_ffi[t]}")
            coerced = coercion_rules[t].format(x=n)
            js_args.append(coerced)
            js_arg_types.append(t)
            js_grad_args.append(coerced)
            js_grad_arg_types.append(t)
        js_arg_type = (
            to_ts[t]
            if t != "Tensor"
            else "Tensor"
        )
        if d:
            js_sig_names.append(n)
            js_sig.append(n + ": " + js_arg_type + " = " + d)
            ts_sig.append(n + "?: " + js_arg_type)
        else:
            js_sig_names.append(n)
            js_sig.append(n + ": " + js_arg_type)
            ts_sig.append(n + ": " + js_arg_type)

    # TODO ret != single value
    ffi_ret = ""
    c_ret = ret
    c_args = ", ".join(c_op_args)
    axes_set = f"""
      auto axes_set = std::unordered_set<int>({first_axes}.begin(), {first_axes}.end());
    """ if first_axes else f"auto axes_set = std::unordered_set<int>{{{first_axis}}};"
    keep_dims_fix = f"""
      {axes_set}
      auto base_shape = {first_tensor}->shape().get();
      std::vector<fl::Dim> new_shape;
      for (auto idx = 0; idx < base_shape.size(); ++idx) {{
        if (axes_set.count(idx) || (axes_set.size() == 0)) {{
          if (keep_dims) {{
            new_shape.emplace_back(1);
          }}
          continue;
        }}
        new_shape.emplace_back(base_shape[idx]);
      }}
      const auto& shape = fl::Shape(new_shape);
      t = fl::reshape(t, shape);
    """
    if ret == "Tensor":
        c_impl.append("fl::Tensor t;")
        if op in reverse_args_row_major or op in op_overwrite_row_major:
            c_impl.append("if (g_row_major) {")
            if op in reverse_args_row_major:
                c_args_reversed = ", ".join(c_op_args[::-1])
                if op in op_overwrite_row_major:
                    c_impl.append(f"t = fl::{op_overwrite_row_major[op]}({c_args_reversed});")
                else:
                    c_impl.append(f"t = fl::{op}({c_args_reversed});")
            else:  # op in op_overwrite_row_major
                c_impl.append(f"t = fl::{op_overwrite_row_major[op]}({c_args});")
            c_impl.append("} else {")
        c_impl.append(f"t = fl::{op}({c_args});")
        if op in c_overwrites and not methods_only:
            c_impl.append(c_overwrites[op](c_op_args))
        if fix_keep_dims:
            c_impl.append(keep_dims_fix)
        if op in reverse_args_row_major or op in op_overwrite_row_major:
            c_impl.append("}")
        c_impl.append(f"g_bytes_used += t.bytes();")
        c_impl.append(f"return new fl::Tensor(t);")
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
    wrap_args = list(zip(js_args, js_arg_types))
    if methods_only:
        wrap_args = [('this', 'Tensor')] + wrap_args
        js_tensor_args = ["this"] + js_tensor_args
    js_ptr_args = [x[0] if x[1] != "Tensor" else f"{x[0]}.ptr" for x in wrap_args]
    js_ptr_result = f"const _ptr = fl._{op}.native({', '.join(js_ptr_args)})"
    js_provenance_args = '||'.join([f"{t}.provenance" for t in js_tensor_args] + [f"{tv}.reduce((r, c) => r || c.provenance, 0)" for tv in js_tensor_vector_args])
    js_requires_grad_args = '||'.join([f"{t}.requires_grad" for t in js_tensor_args] + [f"{tv}.reduce((r, c) => r || c.requires_grad, false)" for tv in js_tensor_vector_args])
    js_requires_grad_args = 'false' if len(js_requires_grad_args) == 0 else js_requires_grad_args
    js_requires_stats = '||'.join([f"{t}.requires_stats" for t in js_tensor_args] + [f"{tv}.reduce((r, c) => r || c.requires_stats, false)" for tv in js_tensor_vector_args])
    js_requires_stats = 'false' if len(js_requires_stats) == 0 else js_requires_stats
    js_grad_args = (['this'] if methods_only else []) + [f"...{n}" if t == "TensorVector" else f"{n}" for n, t in zip(js_grad_args, js_grad_arg_types)]
    js_deps = f"const deps = requires_grad ? [{', '.join(js_grad_args)}] : []"
    js_tensor_call = '_Tensor' if methods_only else 'Tensor'
    js_tensor_construct = f"const t = new {js_tensor_call}({{_ptr: _ptr, _deps: deps}})";
    js = f"""\
{'export function ' if not methods_only else ''}{valid_js(op)}({', '.join(js_sig)}) {{
  {js_impl_full}
  const requires_stats = {js_requires_stats}

  let stats = null
  let recorded_stat = null
  if (requires_stats) {{
    stats = collectStats([{','.join(js_tensor_args)}])
  }}
  if (requires_stats) {{
    recorded_stat = [performance.now(), fl.bytesUsed.native()]
  }}

  {js_ptr_result}
  if(!_ptr) throw new Error('Tensor returned from `{valid_js(op)}` is null; native code likely threw an error...')

  if (requires_stats) {{
    const [t0, b0] = recorded_stat
    const dt = performance.now() - t0
    const db = fl.bytesUsed.native() - b0
    const s = getStack()
    if (s in stats) {{
      stats[s].time += dt
      stats[s].bytes += db
    }} else {{
      stats[s] = {{ time: dt, bytes: db }}
    }}
  }}

  const requires_grad = {js_requires_grad_args}
  {js_deps}
  {js_tensor_construct}
  t.provenance = {js_provenance_args}
  t.requires_grad = requires_grad
  if (requires_stats) {{
    t.requires_stats = true
    t.stats = stats
  }}
  t.op = "{op}";
  return t;
}}{',' if methods_only else ''}"""
    if op in comments and sys.argv[1] == "js":
        js = comments[op][0] + js

    js = textwrap.indent(js, "    ") if methods_only else js
    js += '\n'

    c_impl_str = textwrap.indent("\n".join(c_impl), "  ")
    c = f"""
{c_ret} _{op}({', '.join(c_sig)}) {{
  try {{
    {c_impl_str}
  }} catch (std::exception const& e) {{
    HANDLE_EXCEPTION(e.what());
  }} catch (...) {{
    HANDLE_EXCEPTION("[unknown]");
  }}
}}"""
    full_js.append(js)
    if op in op_aliases:
        for alias in op_aliases[op]:
            alias_js = f"""\
{'export function ' if not methods_only else ''}{alias}({', '.join(js_sig)}) {{
  return {'this.' if methods_only else ''}{valid_js(op)}({', '.join(js_sig_names)})
}}{',' if methods_only else ''}
"""
            alias_js = textwrap.indent(alias_js, "    ") if methods_only else alias_js
            full_js.append(alias_js)
    if supports_method:
        if op in comments:
            full_js_types.append(comments[op][1])
        full_js_types.append(f"  {valid_js(op)}({', '.join(ts_sig[1:])}) : {to_ts[ret]};")
        if op in op_aliases:
            for alias in op_aliases[op]:
                full_js_types.append(f"  {valid_js(alias)}({', '.join(ts_sig[1:])}) : {to_ts[ret]};")
    full_ffi.append(ffi)
    full_c.append(c)

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
import {{ arrayArg }} from '../ffi/ffi_bind_utils'
import {{ fl }} from '../ffi/ffi_flashlight'
import {{ getStack, collectStats }} from './stats'
import type {{ Tensor }} from './tensor'

export const gen_tensor_op_shim = (_Tensor: new (...args: unknown[]) => Tensor) => {{
  return {{{full_js}
  }};
}}
"""
    else:
        # js
        full_js = f"""\
/* GENERATED CODE (gen_binding.py) */
import {{ arrayArg }} from "../ffi/ffi_bind_utils"
import {{ fl }} from "../ffi/ffi_flashlight"
import {{ getStack, collectStats }} from './stats'
import {{ Tensor }} from "./tensor"

{full_js}"""
    print(full_js)

if sys.argv[1] in ["js_ops_interface", "js_ops_types"]:
    full_js_types = "\n".join(full_js_types)
    full_js_types = f"""\
/* GENERATED CODE (gen_binding.py) */
import type {{ Tensor }} from "./tensor";
/** @private */
interface TensorOpsInterface {{
{full_js_types}
}}
export {{ TensorOpsInterface }};"""
    print(full_js_types)
