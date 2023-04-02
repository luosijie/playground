import { Mesh } from 'three'

const SPEED = .1

export default class Windmill {
    isReady: boolean

    main: Mesh
    rotation: number
    constructor () {
        this.isReady = false

        this.main = new Mesh()
        this.rotation = 0
    }

    add (mesh: Mesh) {
        this.main = mesh
        this.isReady = true
    }

    update () {
        this.rotation += SPEED
        this.main.rotation.x = this.rotation
    }
}