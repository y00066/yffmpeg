export class Options {
    private options: (string | number)[] = [];
    setAudioCodec(codec: string): this {
        this.options.push("-c:a", codec);
        return this;
    }
    setAudioBitrate(bitrate: string | number): this {
        this.options.push("-b:a", bitrate);
        return this;
    }
    setAudioChannels(channels: number): this {
        this.options.push("-ac", channels);
        return this;
    }
    setAudioFilter(...filters: string[]): this {
        this._baseFilters("-af", filters);
        return this;
    }
    setAudioSamplingRate(sampleRate: number): this {
        this.options.push("-ar", sampleRate);
        return this;
    }
    setAudioQuality(quality: number): this {
        this.options.push("-aq", quality);
        return this;
    }
    setFilterComplex(...filters: string[]): this {
        this._baseFilters("-filter_complex", filters);
        return this;
    }
    setCodecOptions(...codecOptions: (string | number)[]): this {
        this.setOthers(...codecOptions);
        return this;
    }
    setFormat(format: string): this {
        this.options.push("-f", format);
        return this;
    }
    setVideoFilter(...filters: string[]): this {
        this._baseFilters("-vf", filters);
        return this;
    }
    setVideoCodec(codec: string): this {
        this.options.push("-c:v", codec);
        return this;
    }
    setVideoBitrate(bitrate: number | string): this {
        this.options.push("-b:v", bitrate);
        return this;
    }
    private _baseFilters(
        filterType: string,
        filters: string[]
    ): void {
        this.options.push(filterType, filters.join(","));
    }
    setOthers(...options: (string | number)[]): this {
        this.options.push(...options);
        return this;
    }
    setNoAudio(): this {
        this.options.push("-an");
        return this;
    }
    setNoVideo(): this {
        this.options.push("-vn");
        return this;
    }
    ok(): (string | number)[] {
        return this.options;
    }
}
