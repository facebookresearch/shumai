import { dtype } from './tensor';
export declare function stringToType(str: string): dtype;
export declare function typeToString(dt: any): "Float16" | "Float32" | "Float64" | "BoolInt8" | "Int16" | "Int32" | "Int64" | "BigInt64" | "Uint8" | "Uint16" | "Uint32" | "Uint64" | "BigUint64";
