import { util } from '@shumai/shumai';
export declare function range(length_or_start: number, end_?: number | null, stride_?: number | null): Generator<number, void, unknown>;
export declare function tuiLoad(str: string): void;
export declare function viter(arrayLike: util.ArrayLike | number, callback?: (_: number) => string): Generator<any, void, unknown>;
export declare function shuffle<T>(array: T[]): T[];
