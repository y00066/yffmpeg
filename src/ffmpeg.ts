import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import { Writable, Readable } from "stream";

export class FFmpeg {
    private inputStream: {
        readable: Readable[];
        fileDescriptor: number[];
    };
    private outputStream: {
        writable: Writable[];
        fileDescriptor: number[];
    };
    private ffmpegBinaryPath: string;
    private ffmpegArgs: any[];
    private stdioArgs: any[];

    constructor(ffmpegBinaryPath: string = "ffmpeg") {
        this.ffmpegBinaryPath = ffmpegBinaryPath;
        this.inputStream = {
            readable: [],
            fileDescriptor: []
        };
        this.outputStream = {
            writable: [],
            fileDescriptor: []
        };
        this.ffmpegArgs = ["-hide_banner", "-y"];
        this.stdioArgs = ["pipe", "pipe", "pipe"];
    }

    setOutputOptions(outputOptions: (string | number)[]): this {
        this.ffmpegArgs.push(...outputOptions);
        return this;
    }

    setInputOptions(inputOptions: (string | number)[]): this {
        this.ffmpegArgs.push(...inputOptions);
        return this;
    }

    setFFmpegOptions(ffmpegOptions: (string | number)[]): this {
        this.ffmpegArgs.unshift(...ffmpegOptions);
        return this;
    }

    setInput(input: string | Readable): this {
        if (input instanceof Readable) {
            this.ffmpegArgs.push(
                "-i",
                "pipe:" + this.stdioArgs.length
            );
            this.inputStream.fileDescriptor.push(
                this.stdioArgs.length
            );
            this.inputStream.readable.push(input);
            this.stdioArgs.push("pipe");
        } else {
            this.ffmpegArgs.push("-i", input);
        }
        return this;
    }

    setOutput(output: string | Writable): this {
        if (output instanceof Writable) {
            this.ffmpegArgs.push("pipe:" + this.stdioArgs.length);
            this.outputStream.fileDescriptor.push(
                this.stdioArgs.length
            );
            this.outputStream.writable.push(output);
            this.stdioArgs.push("pipe");
        } else {
            this.ffmpegArgs.push(output);
        }
        return this;
    }

    run(): ChildProcessWithoutNullStreams {
        const ffmpegProcess = spawn(
            this.ffmpegBinaryPath,
            this.ffmpegArgs,
            {
                stdio: this.stdioArgs
            }
        );
        if (this.inputStream.readable.length) {
            this.inputStream.readable.forEach((stream, index) =>
                stream
                    .pipe(
                        ffmpegProcess.stdio[
                            this.inputStream.fileDescriptor[index]
                        ] as Writable
                    )
                    .on("error", (e) =>
                        ffmpegProcess.emit("error", e)
                    )
            );
        }
        if (this.outputStream.writable.length) {
            this.outputStream.writable.forEach((stream, index) =>
                ffmpegProcess.stdio[
                    this.outputStream.fileDescriptor[index]
                ]
                    .pipe(stream)
                    .on("error", (e) =>
                        ffmpegProcess.emit("error", e)
                    )
            );
        }
        return ffmpegProcess;
    }
}
