import { Group, Mesh } from 'three'

const SPEED = .01

export default class Carousel {
    rotation: number

    models: Array<Mesh>
    main: Group

    constructor () {
        this.rotation = 0

        this.models = []
        this.main = new Group()
    }

    // Add relative mesh to models
    add (mesh: Mesh) {
        this.models.push(mesh)
    }

    build () {
        const defaultPosition = this.models[0].position.clone()
        const nums = 6
        const rand = Math.PI * 2 / nums
        this.models.forEach(e => {
            e.position.set(0, 0, 0)
            this.main.add(e)

            for (let i = 1; i < nums; i++) {
                const n = e.clone()
                n.rotation.set(0, 0, rand * i)
                this.main.add(n)
            }

            // this.main.add(e)
        })
        this.main.position.copy(defaultPosition)
    }

    update () {
        this.rotation -= SPEED
        this.main.rotation.z = this.rotation
    }
}