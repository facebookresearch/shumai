/// <reference types="bun-types" />
import { FFIType } from 'bun:ffi';
declare const ffi_tensor: {
    init: {};
    bytesUsed: {
        returns: FFIType;
    };
    dtypeFloat16: {
        returns: FFIType;
    };
    dtypeFloat32: {
        returns: FFIType;
    };
    dtypeFloat64: {
        returns: FFIType;
    };
    dtypeBoolInt8: {
        returns: FFIType;
    };
    dtypeInt16: {
        returns: FFIType;
    };
    dtypeInt32: {
        returns: FFIType;
    };
    dtypeInt64: {
        returns: FFIType;
    };
    dtypeUint8: {
        returns: FFIType;
    };
    dtypeUint16: {
        returns: FFIType;
    };
    dtypeUint32: {
        returns: FFIType;
    };
    dtypeUint64: {
        returns: FFIType;
    };
    setRowMajor: {};
    setColMajor: {};
    isRowMajor: {
        returns: FFIType;
    };
    isColMajor: {
        returns: FFIType;
    };
    createTensor: {
        args: FFIType[];
        returns: FFIType;
    };
    destroyTensor: {
        args: FFIType[];
    };
    genTensorDestroyer: {
        returns: FFIType;
    };
    dispose: {
        args: FFIType[];
    };
    tensorFromFloat16Buffer: {
        args: FFIType[];
        returns: FFIType;
    };
    tensorFromFloat32Buffer: {
        args: FFIType[];
        returns: FFIType;
    };
    tensorFromFloat64Buffer: {
        args: FFIType[];
        returns: FFIType;
    };
    tensorFromInt8Buffer: {
        args: FFIType[];
        returns: FFIType;
    };
    tensorFromInt16Buffer: {
        args: FFIType[];
        returns: FFIType;
    };
    tensorFromInt32Buffer: {
        args: FFIType[];
        returns: FFIType;
    };
    tensorFromInt64Buffer: {
        args: FFIType[];
        returns: FFIType;
    };
    tensorFromUint8Buffer: {
        args: FFIType[];
        returns: FFIType;
    };
    tensorFromUint16Buffer: {
        args: FFIType[];
        returns: FFIType;
    };
    tensorFromUint32Buffer: {
        args: FFIType[];
        returns: FFIType;
    };
    tensorFromUint64Buffer: {
        args: FFIType[];
        returns: FFIType;
    };
    load: {
        args: FFIType[];
        returns: FFIType;
    };
    _conv2dBackwardData: {
        args: FFIType[];
        returns: FFIType;
    };
    _astype: {
        args: FFIType[];
        returns: FFIType;
    };
    _save: {
        args: FFIType[];
    };
    _eval: {
        args: FFIType[];
    };
    _float16Buffer: {
        args: FFIType[];
        returns: FFIType;
    };
    _float32Buffer: {
        args: FFIType[];
        returns: FFIType;
    };
    _float64Buffer: {
        args: FFIType[];
        returns: FFIType;
    };
    _int16Buffer: {
        args: FFIType[];
        returns: FFIType;
    };
    _int32Buffer: {
        args: FFIType[];
        returns: FFIType;
    };
    _int64Buffer: {
        args: FFIType[];
        returns: FFIType;
    };
    _uint8Buffer: {
        args: FFIType[];
        returns: FFIType;
    };
    _uint16Buffer: {
        args: FFIType[];
        returns: FFIType;
    };
    _uint32Buffer: {
        args: FFIType[];
        returns: FFIType;
    };
    _uint64Buffer: {
        args: FFIType[];
        returns: FFIType;
    };
    _index: {
        args: FFIType[];
        returns: FFIType;
    };
    _indexedAssign: {
        args: FFIType[];
        returns: FFIType;
    };
    _flatten: {
        args: FFIType[];
        returns: FFIType;
    };
    _asContiguousTensor: {
        args: FFIType[];
        returns: FFIType;
    };
    _pad: {
        args: FFIType[];
        returns: FFIType;
    };
    _copy: {
        args: FFIType[];
        returns: FFIType;
    };
    _float16Scalar: {
        args: FFIType[];
        returns: FFIType;
    };
    _float32Scalar: {
        args: FFIType[];
        returns: FFIType;
    };
    _float64Scalar: {
        args: FFIType[];
        returns: FFIType;
    };
    _boolInt8Scalar: {
        args: FFIType[];
        returns: FFIType;
    };
    _int16Scalar: {
        args: FFIType[];
        returns: FFIType;
    };
    _int32Scalar: {
        args: FFIType[];
        returns: FFIType;
    };
    _int64Scalar: {
        args: FFIType[];
        returns: FFIType;
    };
    _uint8Scalar: {
        args: FFIType[];
        returns: FFIType;
    };
    _uint16Scalar: {
        args: FFIType[];
        returns: FFIType;
    };
    _uint32Scalar: {
        args: FFIType[];
        returns: FFIType;
    };
    _uint64Scalar: {
        args: FFIType[];
        returns: FFIType;
    };
    _elements: {
        args: FFIType[];
        returns: FFIType;
    };
    _bytes: {
        args: FFIType[];
        returns: FFIType;
    };
    _ndim: {
        args: FFIType[];
        returns: FFIType;
    };
    _dtype: {
        args: FFIType[];
        returns: FFIType;
    };
    _shape: {
        args: FFIType[];
        returns: FFIType;
    };
};
export { ffi_tensor };
