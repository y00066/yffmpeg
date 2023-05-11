const { Writable, Readable, PassThrough, Duplex } = require("stream");
const spawn = require("child_process").spawn;
const EventEmitter = require("events");

module.exports = class Yffmpeg extends EventEmitter {
    constructor() {
        super();
        this._inputStreamData = { stream: [], fd: [] };
        this._outputStreamData = { stream: [], fd: [] };
        this._stdio = ["ignore", "ignore", "pipe"];
        this._ffmpegArgs = [];
    }

    input(inp, options = {}) {
        if (inp instanceof Readable || inp instanceof Duplex || inp instanceof PassThrough) {
            this._ffmpegArgs.push(
                ...Object.entries(options)
                    .flat()
                    .concat("-i", "pipe:" + this._stdio.length)
            );
            this._inputStreamData.fd.push(this._stdio.length);
            this._inputStreamData.stream.push(inp);
            this._stdio.push("pipe");
        } else {
            this._ffmpegArgs.push(...Object.entries(options).flat().concat("-i", inp));
        }
        return this;
    }

    output(outp, options = {}) {
        if (outp instanceof PassThrough || outp instanceof Writable || outp instanceof Duplex) {
            if (!options["-f"]) throw new Error("To use output stream, add the output option { '-f': 'media format' }");
            this._ffmpegArgs.push(
                ...Object.entries(options)
                    .flat()
                    .concat("pipe:" + this._stdio.length)
            );
            this._outputStreamData.fd.push(this._stdio.length);
            this._outputStreamData.stream.push(outp);
            this._stdio.push("pipe");
        } else {
            this._ffmpegArgs.push(...Object.entries(options).flat().concat(outp));
        }
        return this;
    }

    run() {
        const fproc = spawn("ffmpeg", this._ffmpegArgs.concat("-y", "-hide_banner"), {
            stdio: this._stdio
        });
        if (this._inputStreamData.stream.length !== 0) {
            this._inputStreamData.stream.map((stream, index) => {
                stream.pipe(fproc.stdio[this._inputStreamData.fd[index]]).on("error", () => {});
            });
        }
        if (this._outputStreamData.stream.length !== 0) {
            this._outputStreamData.stream.map((stream, index) => {
                fproc.stdio[this._outputStreamData.fd[index]]
                    .pipe(stream)
                    .on("error", (err) => this.emit("error", err));
            });
        }
        fproc.stderr.on("data", (data) => this.emit("flog", data.toString()));
        fproc.on("error", (err) => this.emit("error", err));
        fproc.on("close", (code) => {
            if (code === 0) {
                this.emit("finish");
            }
        });
    }
};
