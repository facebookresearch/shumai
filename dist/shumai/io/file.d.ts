/// <reference types="bun-types" />
/**
 *
 * An extremely fast JavaScript native (bun) line reader for use with
 * arbitrary files.  This is included as a utility for manual data pre-processing.
 *
 * @example
 *
 * ```javascript
 * for await (let line of sm.io.readlines('myfile.txt')) {
 *   console.log(line.split(',')[0])
 * }
 * ```
 *
 * @param filename - The file to open and asynchronously read from
 * @param utfLabel - The label of the encoder
 * @param buffer_len - The size of the buffer to read into before flushing to the user
 * @returns A generator of each line in the file
 */
export declare function readlines(filename: string, utfLabel?: Encoding, buffer_len?: number): AsyncGenerator<any, void, unknown>;
export declare function readlinesCallback(filename: string, callback: any, finishCallback?: any, utfLabel?: Encoding, buffer_len?: number): void;
