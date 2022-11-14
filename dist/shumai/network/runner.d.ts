export declare function remote_runner(url: any): {
    shell(cmd: any): Promise<string>;
    logs: () => Promise<{
        stdout: string;
        stderr: string;
    }>;
    serve_model(file: any, port?: number): Promise<(t: import("..").Tensor) => Promise<any>>;
};
export declare function serve_runner(): void;
