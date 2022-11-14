import * as sm from '../tensor';
export declare function encodeBinary(tensor: sm.Tensor): ArrayBuffer;
export declare function decodeBinary(buf: ArrayBuffer): sm.Tensor;
export declare function encodeBase64(tensor: sm.Tensor): string;
export declare function decodeBase64(base64String: string): sm.Tensor;
export declare function encodeReadable(tensor: sm.Tensor): string;
export declare function decodeReadable(readableString: string): sm.Tensor;
