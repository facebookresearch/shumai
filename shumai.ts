export {
  scalar,
  tensor,
  backward,
  bytesUsed,
  Tensor
}
from "./src/tensor/tensor";
export * from "./src/tensor/tensor_ops_gen";
import {
  TensorInterface
} from "./src/tensor/tensor_interface";
import {
  TensorOpsInterface
} from "./src/tensor/tensor_ops_interface_gen";
export type TensorInterface = TensorInterface
export type TensorOpsInterface = TensorOpsInterface