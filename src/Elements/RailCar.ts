import { Group } from 'three'

export default class RailCar {
    model: Group
    main: Group
    constructor (model: Group) {
        this.model = model
        this.main = this.createMain()
    }

    private createMain () {
        const main = new Group()
        const children = this.model.children
        const startCenter = children[0].position.clone()
        children.forEach(e => {
            e.position.set(0, 0, 0)
            main.add(e.clone())
        })

        console.log('group', main)
        // this.main.rotateY(Math.PI)
        main.position.copy(startCenter)
        return main
    }
}