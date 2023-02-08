import { Group, Mesh } from 'three'

export default class RailCar {
    models: Array<Mesh>
    main: Group
    constructor (models: Array<Mesh>) {
        
        this.models = models
        this.main = this.createMain()
    }

    private createMain () {
        const main = new Group()
        const startPosition = this.models[0].position.clone()
        this.models.forEach(e => {
            e.position.set(0, 0, 0)
            main.add(e)
        })

        // this.main.rotateY(Math.PI)
        main.position.copy(startPosition)
        return main
    }
}