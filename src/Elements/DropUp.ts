import { Group, Mesh } from 'three'
import { gsap } from 'gsap'

export default class DropUp {
    height: number

    main: Group
    models: Array<Mesh>
    constructor () {
        this.height = -4

        this.main = new Group()
        this.models = []

        gsap.timeline({ repeat: -1, repeatDelay: 0 })
            .to(this, { height: 4.5, duration: 2 })
            .to(this, { height: -4, duration: 1})
    }

    // Add relative mesh to models
    add (mesh: Mesh) {
        this.models.push(mesh)
    }

    build () {
        this.models.forEach(e => {
            this.main.add(e)
        })
    }

    update () {
        this.main.position.z = this.height
    }
}