import { Howl } from 'howler'

export interface SoundOption {
    src: Array<string>
    loop?: boolean,
    volume?: number
}

export default class Sound {
    howl: Howl
    playId: number
    constructor (option: SoundOption) {

        this.howl = new Howl(option)

        this.playId = 0
    }

    play () {
        if (this.howl.state() !== 'loaded') return

        if (this.playId) {
            if (this.howl.playing(this.playId)) return
            this.howl.play(this.playId)
        } else {
            this.playId = this.howl.play()
        }
        
    }

    stop () {
        this.howl.stop(this.playId)
    }

    volume (value: number) {
        this.howl.volume(value)
    }

}