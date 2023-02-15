import { Group, Mesh, Vector3 } from 'three'
import Physics from './Physics'
import createPhysics from '@/utils/createPhysics'
import { SHAPE_TYPES } from 'cannon-es'
import matcapMaterial from '@/materials/matcap'

const colors = [ 'blue', 'red', 'yellow', 'red', 'brown' ]

export default class Bricks {
    models: Array<Mesh>
    physics: Physics
    main: Group

    rotation: number
    tl: GSAPTimeline
    constructor (physics: Physics) {
        this.physics = physics

        this.models = []

        this.main = new Group()

    }

    private createBrick (position: Vector3) {
        const index = Math.round(Math.random())
        const scale = Math.random() * .8 + .8

        const brick = this.models[index].clone()
        brick.position.copy(position)
        brick.scale.set(scale, scale, scale)

        // brick.material = matcap()

        createPhysics({ mesh: brick, physics: this.physics, shapeType: SHAPE_TYPES.BOX, mass: 100 })

        return brick
    }

    build (resources: any) {
        const modelBricks = resources['model-bricks'].scene
        this.models.push(...modelBricks.children)
      
        // set random trees
        const min = 25
        const max = 80
        const nums = 30

        for (let i = 0; i < nums; i++) {

            const distance = Math.random() * (max - min) + min
            const angle = Math.random() * Math.PI * 2

            const position = new Vector3(
                Math.cos(angle) * distance,
                Math.sin(angle) * distance,
                0
            )
            const brick = this.createBrick(position)
            const color = colors[Math.round(Math.random() * 3)]
            brick.material = matcapMaterial(resources[`matcap-${color}`])
            this.main.add(brick)
        }

        this.models.forEach(e => {
            e.parent?.remove(e)
        })
    }

    update () {
        this.main.rotation.y = this.rotation
    }
}