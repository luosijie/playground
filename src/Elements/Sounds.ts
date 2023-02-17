import { Howl } from 'howler'

const sources = [
    'sounds/car.mp3'
]

export default class Sounds {
    howl: Howl
    constructor () {

        this.howl = new Howl({
            src: sources
        })
    }

    play () {
        this.howl.play()
    }
}