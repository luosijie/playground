import { Body, ContactMaterial, Material, Plane, SAPBroadphase, World } from 'cannon-es'

interface Materials {
    ground: Material
    wheel: Material
    static: Material
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
        world.allowSleep = true
        world.defaultContactMaterial.friction = 0

        return world
    }

    private createMaterials () {
        const materials = {
            ground: new Material('ground'),
            wheel: new Material('wheel'),
            static: new Material('static')
        }

        const contactGroundWheel = new ContactMaterial(
            materials.ground,
            materials.wheel, 
            {
                friction: .5,
                restitution: 0,
                contactEquationStiffness: 1000
            }
        )
        this.world.addContactMaterial(contactGroundWheel)

        const contactGroundStatic = new ContactMaterial(
            materials.ground,
            materials.static, 
            {
                friction: .05,
                restitution: 0.3,
                contactEquationStiffness: 1000
            }
        )
        this.world.addContactMaterial(contactGroundStatic)

        const contactStatics = new ContactMaterial(
            materials.static,
            materials.static, 
            {
                friction: .5,
                restitution: 0.3,
                contactEquationStiffness: 1000
            }
        )
        this.world.addContactMaterial(contactStatics)

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