import { Group, Mesh, Vector3 } from 'three'
import Physics, { CollideSoundName } from './Physics'
import { SHAPE_TYPES } from 'cannon-es'
import CustomShadow, { CustomShadowType } from './CustomShadow'

const defaultTrees = [
    new Vector3(18.4949, -21.9102, 0),
    new Vector3(19.6496, -21.9102, 0),

    new Vector3(4.15384, -24.487, 0),
    new Vector3(21.1227, -21.0812, 0),
    new Vector3(22.1645, -23.562, 0),
    new Vector3(25.2483, -8.6961, 0),
    new Vector3(28.142, -6.64796, 0),
    new Vector3(23.5403, -5.8931, 0),
    new Vector3(21.8172, -3.89102, 0),
    new Vector3(19.2888, -3.20587, 0),
    new Vector3(21.5826, -2.62404, 0)
]

export default class Trees {
    physics: Physics

    models: Array<Mesh>
    
    main: Group

    rotation: number
    tl: GSAPTimeline
    constructor (physics: Physics) {
        this.physics = physics

        this.models = []

        this.main = new Group()

    }

    private createTree (position: Vector3) {
        const index = Math.round(Math.random())
        const scale = Math.random() * .8 + .8

        const tree = this.models[index].clone()
        tree.position.copy(position)
        tree.scale.set(scale, scale, scale)
        
        const body = this.physics.createBody({ mesh: tree, shapeType: SHAPE_TYPES.CYLINDER, mass: 0, collideSound: CollideSoundName.Tree })
        body.sleep()

        const shadow = new CustomShadow(CustomShadowType.circle)
        shadow.build(tree)
        this.main.add(shadow.main)

        return tree
    }

    add (modelMesh: Mesh) {
        this.models.push(modelMesh)
        // const mesh = this.createMesh(modelMesh)
        // this.main.add (mesh)

        // setPhysics(modelMesh, this.physics, SHAPE_TYPES.CYLINDER)
    }

    build () {
        // set default trees
        defaultTrees.forEach(position => {
            const tree = this.createTree(position)
            this.main.add(tree)
        })

        // set random trees
        const min = 25
        const max = 80
        const nums = 20

        for (let i = 0; i < nums; i++) {

            const distance = Math.random() * (max - min) + min
            const angle = Math.random() * Math.PI * 2

            const position = new Vector3(
                Math.cos(angle) * distance,
                Math.sin(angle) * distance,
                0
            )
            const tree = this.createTree(position)
            this.main.add(tree)
        }

        this.models.forEach(e => {
            e.parent?.remove(e)
        })
    }
}