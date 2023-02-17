import { Group, Mesh } from 'three'
import Physics from './Physics'
import Shield from './Shield'

export default class Shields {
    physics: Physics
    main: Group

    rotation: number
    tl: GSAPTimeline
    constructor (physics: Physics) {
        this.physics = physics

        this.main = new Group()

    }

    add (modelMesh: Mesh) {
        const shield = new Shield(this.physics, modelMesh)
        this.main.add(shield.main)
    }
}