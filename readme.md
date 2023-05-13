## yffmpeg

Can accept multiple input streams and multiple output streams.

## Installing

```shell
# using yarn
yarn add yffmpeg@latest

# using npm
npm install yffmpeg@latest
```

## Example

**Transcoding audio:**

```js
const Yffmpeg = require("yffmpeg");
const fs = require("fs");

const readable = fs.createReadStream("./input.mp3");
const writable = fs.createWriteStream("./output.ogg");

new Yffmpeg()
    .input(readable)
    .output(writable, ["-f", "ogg"])
    .on("error", console.log)
    .on("progress", console.log)
    .on("end", console.log)
    .run();
```

---

```js
const Yffmpeg = require("yffmpeg");

const audioInput = "./input.mp3";
const audioOutput1 = "./output.wav";
const audioOutput2 = "./output.flac";

new Yffmpeg()
    .input(audioInput, ["-f", "mp3"])
    .output(audioOutput1, ["-c:a", "pcm_s16le"])
    .output(audioOutput2, ["-c:a", "flac"])
    .on("error", console.log)
    .on("progress", console.log)
    .on("end", console.log)
    .run();
```

---

**Combine audio:**

```js
const Yffmpeg = require("yffmpeg");
const fs = require("fs");
const { PassThrough } = require("stream");

const pass = new PassThrough();

const readable1 = fs.createReadStream("./input1.mp3");
const readable2 = fs.createReadStream("./input2.mp3");
const writable = fs.createWriteStream("./output.mp3");
pass.pipe(writable);

new Yffmpeg()
    .input(readable1)
    .input(readable2)
    .output(pass, ["-f", "mp3", "-filter_complex", "amix=inputs=2:duration=longest:dropout_transition=2"])
    .on("error", console.log)
    .on("progress", console.log)
    .on("end", console.log)
    .run();
```

---

**Input from url:**

```js
const Yffmpeg = require("yffmpeg");

const audioUrl = "https://ia902203.us.archive.org/11/items/testmp3testfile/mpthreetest.mp3";
const audioOutput = "./audio.mp3";

new Yffmpeg()
    .input(audioUrl)
    .output(audioOutput)
    .on("progress", console.log)
    .on("error", console.log)
    .on("end", console.log)
    .run();
```

---

**Manually setting the binary path for FFmpeg:**

```js
const ffmpegBinaryPath = "/usr/bin/ffmpeg";

new Yffmpeg(ffmpegBinaryPath);
```

## API

#### input(inp, [options])

-   `inp`: _string_ | _stream.Readable_ | _stream.Duplex_ | _stream.PassThrough_
-   `options`: _Array<string | number>_ - FFmpeg input options

#### output(outp, [options])

-   `outp`: _string_ | _stream.Duplex_ | _stream.PassThrough_ | _stream.Writable_
-   `options`: _Array<string | number>_ - FFmpeg output options

#### on(event, fn)

-   `event`: _string_
-   `fn`: _callback function_

Available event:

-   error
-   progress
-   end

#### run()

Start ffmpeg process.
