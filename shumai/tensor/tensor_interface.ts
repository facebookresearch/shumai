interface TensorInterface {
  ptr: number
  requires_grad: boolean
  elements: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  grad_callback_async?: (grad: any) => Promise<void>
}

export { TensorInterface }
