## Simple ffmpeg API for nodejs

-   API Reference: <https://y00066.github.io/yffmpeg>
-   Github Repo: <https://github.com/y00066/yffmpeg>
-   NPM: <https://www.npmjs.com/package/yffmpeg>

## Install

```bash
# yarn
yarn add yffmpeg@latest
# npm
npm install yffmpeg@latest
```

## Usage

**Transcoding Audio:**

```js
const { FFmpeg, Options } = require("yffmpeg")

new FFmpeg()
    .setInput("./audio.mp3")
    .setOutputOptions(
        new Options()
            .setAudioCodec("flac")
            .setAudioBitrate("1411k")
            .setAudioSamplingRate(44100)
            .setAudioChannels(2)
            .setCodecOptions("-compression_level", 11)
            .setAudioFilter(
                "aecho=0.8:0.88:1000:0.3",
                "volume=0.2dB"
            )
            .ok()
    )
    .setOutput("./audio.flac")
    .run()
```

**Input/Output Stream:**

Suport multiple input/output stream.

```js
const { FFmpeg, Options } = require("yffmpeg")
const fs = require("fs")

new FFmpeg()
    .setInput(fs.createReadStream("input-audio.m4a"))
    .setInput(fs.createReadStream("input-video.mp4"))
    .setOutputOptions(
        new Options()
            .setFormat("mp4")
            .setAudioCodec("copy")
            .setVideoCodec("copy")
            .ok()
    )
    .setOutput(fs.createWriteStream("video.mp4"))
    .run()
```

**Listening to the event:**

```js
const { FFmpeg } = require("yffmpeg")

const ffmpeg = new FFmpeg().setInput().setOutput().run()

ffmpeg.on("error", (error) => console.log(error))
ffmpeg.on("close", (code) => console.log("ffmpeg exited with code: " + code))
ffmpeg.stderr.on("data", (data) => console.log("stderr: " + data))
ffmpeg.stdout.on("data", (data) => console.log("stdout: " + data))
```

**Manually Set ffmpeg Binary Location:**

```js
const { FFmpeg } = require("yffmpeg")

new FFmpeg("/usr/bin/ffmpeg")
```