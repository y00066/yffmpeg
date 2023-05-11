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
    .output(writable, { "-f": "ogg" })
    .on("error", console.log)
    .on("flog", console.log)
    .on("finish", () => console.log("process finished"))
    .run();
```

---

```js
const Yffmpeg = require("yffmpeg");

const audioInput = "./input.mp3";
const audioOutput1 = "./output.wav";
const audioOutput2 = "./output.flac";

new Yffmpeg()
    .input(audioInput)
    .output(audioOutput1)
    .output(audioOutput2)
    .on("error", console.log)
    .on("flog", console.log)
    .on("finish", () => console.log("process finished"))
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
    .output(pass, { "-f": "mp3", "-filter_complex": "amix=inputs=2:duration=longest:dropout_transition=2" })
    .on("error", console.log)
    .on("flog", console.log)
    .on("finish", () => console.log("process finished"))
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
    .output(audioOutput, { "-loglevel": "error" })
    .on("error", console.log)
    .on("flog", console.log)
    .on("finish", () => console.log("process finished"))
    .run();
```

## API

#### input(inp, [options])

-   `inp`: _string_ | _stream.Readable_ | _stream.Duplex_ | _stream.PassThrough_
-   `options`: _Object_ - FFmpeg input options

#### output(outp, [options])

-   `outp`: _string_ | _stream.Duplex_ | _stream.PassThrough_ | _stream.Writable_
-   `options`: _Object_ - FFmpeg output options

#### on(event, fn)

-   `event`: _string_
-   `fn`: _callback function_

Available event:

-   `error` - process error
-   `flog` - ffmpeg log
-   `finish` - process finished

#### execute()

Start ffmpeg process.
