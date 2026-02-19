export function GifWriter(buf: any, width: any, height: any, gopts: any): void;
export class GifWriter {
    constructor(buf: any, width: any, height: any, gopts: any);
    addFrame: (x: any, y: any, w: any, h: any, indexed_pixels: any, opts: any) => number;
    end: () => number;
    getOutputBuffer: () => any;
    setOutputBuffer: (v: any) => void;
    getOutputBufferPosition: () => number;
    setOutputBufferPosition: (v: any) => void;
}
