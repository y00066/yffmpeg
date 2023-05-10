const { Writable, Readable, PassThrough, Duplex } = require("stream");
const spawn = require("child_process").spawn;

module.exports = class Yffmpeg {
    constructor() {
        this.inputStreamData = { stream: [], fd: [] };
        this.outputStreamData = { stream: [], fd: [] };
        this.stdio = ["ignore", "pipe", "pipe"];
        this.ffmpegArgs = [];
    }

    input(inp, options = {}) {
        if (inp instanceof Readable || inp instanceof Duplex || inp instanceof PassThrough) {
            this.ffmpegArgs.push(
                ...Object.entries(options)
                    .flat()
                    .concat("-i", "pipe:" + this.stdio.length)
            );
            this.inputStreamData.fd.push(this.stdio.length);
            this.inputStreamData.stream.push(inp);
            this.stdio.push("pipe");
        } else {
            this.ffmpegArgs.push(...Object.entries(options).flat().concat("-i", inp));
        }
        return this;
    }

    output(outp, options = {}) {
        if (outp instanceof PassThrough || outp instanceof Writable || outp instanceof Duplex) {
            if (!options["-f"]) throw new Error("To use output stream, add the option { '-f': 'media format' }");
            this.ffmpegArgs.push(
                ...Object.entries(options)
                    .flat()
                    .concat("pipe:" + this.stdio.length)
            );
            this.outputStreamData.fd.push(this.stdio.length);
            this.outputStreamData.stream.push(outp);
            this.stdio.push("pipe");
        } else {
            this.ffmpegArgs.push(...Object.entries(options).flat().concat(outp));
        }
        return this;
    }

    execute() {
        return new Promise((resolve, reject) => {
            try {
                const fproc = spawn("ffmpeg", this.ffmpegArgs.concat("-y", "-hide_banner"), { stdio: this.stdio });
                if (this.inputStreamData.stream.length !== 0) {
                    this.inputStreamData.stream.map((stream, index) => {
                        stream.pipe(fproc.stdio[this.inputStreamData.fd[index]]).on("error", () => {});
                    });
                }
                if (this.outputStreamData.stream.length !== 0) {
                    this.outputStreamData.stream.map((stream, index) => {
                        fproc.stdio[this.outputStreamData.fd[index]].pipe(stream);
                    });
                }
                fproc.stderr.on("data", (data) => console.log(data.toString()));
                fproc.stdout.on("data", (data) => console.log(data.toString()));
                fproc.on("error", reject).on("close", (code) => {
                    if (code !== 0) {
                        reject(new Error("Ffmpeg exited with code: " + code));
                    } else {
                        resolve();
                    }
                });
            } catch (err) {
                reject(err);
            }
        });
    }
};
