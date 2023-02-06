export interface Size {
    width: number,
    height: number
}

export interface Config {
    progress: number,
    canvas: HTMLCanvasElement,
    images: Array<HTMLImageElement>,
    size: Size
}