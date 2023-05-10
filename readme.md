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

const readable = fs.createReadStream("./audio.mp3");
const writable = fs.createWriteStream("./audio.ogg");

new Yffmpeg()
    .input(readable)
    .output(writable, { "-f": "ogg", "-c:a": "libvorbis" })
    .execute()
    .then(() => console.log("process finished"))
    .catch((err) => console.log(err));
```

---

```js
const Yffmpeg = require("yffmpeg");
const fs = require("fs");

const readable = fs.createReadStream("./audio.mp3");
const writable1 = fs.createWriteStream("./audio.ogg");
const writable2 = fs.createWriteStream("./audio.flac");

new Yffmpeg()
    .input(readable, { "-f": "mp3" })
    .output(writable1, { "-f": "ogg", "-c:a": "libvorbis", "-b:a": "128k" })
    .output(writable2, { "-f": "flac", "-c:a": "flac", "-b:a": "1411k" })
    .execute()
    .then(() => console.log("process finished"))
    .catch((err) => console.log(err));
```

---

**Combine audio:**

```js
const Yffmpeg = require("yffmpeg");
const fs = require("fs");
const { PassThrough } = require("stream");

const pass = new PassThrough();

const readable1 = fs.createReadStream("./audio1.mp3");
const readable2 = fs.createReadStream("./audio2.mp3");
const writable = fs.createWriteStream("./audio.mp3");

pass.pipe(writable);

new Yffmpeg()
    .input(readable1)
    .input(readable2)
    .output(pass, { "-f": "mp3", "-filter_complex": "amix=inputs=2:duration=longest:dropout_transition=2" })
    .execute()
    .then(() => console.log("process finished"))
    .catch((err) => console.log(err));
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
    .execute()
    .then(() => console.log("process finished"))
    .catch((err) => console.log(err));
```

---

**Disable ffmpeg log:**

```js
const Yffmpeg = require("yffmpeg");

new Yffmpeg()
    .input("./input.mp4")
    .output("./output.avi", { "-loglevel": 0 })
    .execute()
    .then(() => console.log("process finished"))
    .catch((err) => console.log(err));
```

## API

#### input(inp, [options])

-   `inp`: _string_ | _stream.Readable_ | _stream.Duplex_ | _stream.PassThrough_
-   `options`: _Object_ - FFmpeg input options

#### output(outp, [options])

-   `outp`: _string_ | _stream.Duplex_ | _stream.PassThrough_ | _stream.Writable_
-   `options`: _Object_ - FFmpeg output options

#### execute()

Start ffmpeg process.
