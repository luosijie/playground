import { Group, Mesh } from 'three'

export default class RailCar {
    models: Array<Mesh>
    main: Group
    constructor () {
        this.models = []
        this.main = new Group()
    }

    // Add relative mesh to models
    add (mesh: Mesh) {
        this.models.push(mesh)
    }

    build () {
        const defaultPosition = this.models[0].position.clone()
        this.models.forEach(e => {
            e.position.set(0, 0, 0)
            this.main.add(e)
        })
        this.main.position.copy(defaultPosition)
    }
}