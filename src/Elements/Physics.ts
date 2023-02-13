import { Body, ContactMaterial, Material, Plane, SAPBroadphase, World } from 'cannon-es'

interface Materials {
    ground: Material
    wheel: Material
}

export default class Physics {
    world: World
    materials: Materials
    constructor () {
        this.world = this.createWorld()
        this.materials = this.createMaterials()

        this.setGround()
    }

    private createWorld () {
        const world = new World()
        world.gravity.set(0, 0, -9.82)
        world.broadphase = new SAPBroadphase(world)
        world.defaultContactMaterial.friction = 0

        return world
    }

    private createMaterials () {
        const materials = {
            ground: new Material('ground'),
            wheel: new Material('wheel')
        }

        const contactWheelGround = new ContactMaterial(
            materials.wheel, 
            materials.ground,
            {
                friction: .5,
                restitution: 0,
                contactEquationStiffness: 1000
            }
        )

        this.world.addContactMaterial(contactWheelGround)

        return materials
    }

    private setGround () {
        const ground = new Body({
            mass: 0,
            material: this.materials.ground
        })
        ground.addShape(new Plane())

        this.world.addBody(ground)
    }
}