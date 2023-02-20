import { Group, Mesh, Vector3 } from 'three'
import Physics, { CollideSoundName } from './Physics'
import { SHAPE_TYPES } from 'cannon-es'
import matcapMaterial from '@/materials/matcap'
import { Body } from 'cannon-es'
import CustomShadow from './CustomShadow'

const colors = [ 'blue', 'red', 'yellow', 'red', 'brown' ]

export default class Bricks {

    resources: any 
    models: Array<Mesh>

    physics: Physics

    main: Group
    meshes: Array<Mesh>
    shadows: Array<CustomShadow>

    physicsBodies: Array<Body>

    constructor (physics: Physics) {
        this.physics = physics

        this.models = []

        this.main = new Group()
        this.shadows = []
        this.meshes = []

        this.physicsBodies = []

    }

    private createBrick (position: Vector3) {
        const index = Math.round(Math.random())
        const scale = Math.random() * .8 + .8

        const brick = this.models[index].clone()
        brick.position.copy(position)
        brick.scale.set(scale, scale, scale)

        // brick.material = matcap()

        return brick
    }

    add (resources: any) {
        this.resources = resources
    }

    build () {
        const modelBricks = this.resources['model-bricks'].scene
        this.models.push(...modelBricks.children)
      
        // set random trees
        const min = 30
        const max = 60
        const nums = 30

        for (let i = 0; i < nums; i++) {

            const distance = Math.random() * (max - min) + min
            const angle = Math.random() * Math.PI * 2

            const position = new Vector3(
                Math.cos(angle) * distance,
                Math.sin(angle) * distance,
                10
            )
            const brick = this.createBrick(position)
            const color = colors[Math.round(Math.random() * 3)]
            brick.material = matcapMaterial(this.resources[`matcap-${color}`])
            this.meshes.push(brick)
            this.main.add(brick)

            const brickPhysics = this.physics.createBody({ mesh: brick, shapeType: SHAPE_TYPES.BOX, mass: 10, collideSound: CollideSoundName.Brick })
            brickPhysics.wakeUp()
            this.physicsBodies.push(brickPhysics)

            const shadow = new CustomShadow()
            shadow.build(brick)
            this.shadows.push(shadow)
            this.main.add(shadow.main)
        }

        // destroy original models
        this.models.forEach(e => {
            e.parent?.remove(e)
        })
    }

    update () {
        this.physicsBodies.forEach((e: Body, i: number) => {
            const mesh = this.meshes[i]
            mesh.position.set(e.position.x, e.position.y, e.position.z)
            mesh.quaternion.set(e.quaternion.x, e.quaternion.y, e.quaternion.z, e.quaternion.w)

            this.shadows[i].update()
        })
    }
}