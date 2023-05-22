import { Body, ContactMaterial, Material, Plane, SAPBroadphase, World, BodyType, BODY_TYPES, Box, Cylinder, Quaternion, ShapeType, SHAPE_TYPES, Vec3} from 'cannon-es'

import { Box3, Mesh} from 'three'
import Sound from './Sound'

interface Materials {
    ground: Material
    wheel: Material
    default: Material
}

export enum CollideSoundName {
    Wall = 'Wall',
    Tree = 'Tree',
    Brick = 'Brick'
}

interface BodyConfig {
    mesh: Mesh
    shapeType: ShapeType
    mass: number
    type?: BodyType,
    collideSound?: CollideSoundName
}

export default class Physics {
    world: World
    materials: Materials
    collideSounds: { [key in CollideSoundName]: Sound }
    constructor () {
        this.world = this.createWorld()
        this.materials = this.createMaterials()
        this.collideSounds = this.createCollideSounds()
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
            default: new Material('default')
        }

        const contactGroundWheel = new ContactMaterial(
            materials.ground,
            materials.wheel, 
            {
                friction: 1,
                restitution: 0,
                contactEquationStiffness: 1000
            }
        )
        this.world.addContactMaterial(contactGroundWheel)

        const contactGroundDefault = new ContactMaterial(
            materials.ground,
            materials.default, 
            {
                friction: .05,
                restitution: 0.3,
                contactEquationStiffness: 1000
            }
        )
        this.world.addContactMaterial(contactGroundDefault)

        const contactStatics = new ContactMaterial(
            materials.default,
            materials.default, 
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

    private createCollideSounds () {
        const sounds = {
            [CollideSoundName.Wall]: new Sound({ src: [ 'sounds/wall-hit.mp3' ], volume: .3 }),
            [CollideSoundName.Tree]: new Sound({ src: [ 'sounds/tree-hit.mp3' ], volume: .3 }),
            [CollideSoundName.Brick]: new Sound({ src: [ 'sounds/brick-hit.mp3' ], volume: .3 }),
        }
        return sounds
    }

    createBody (config: BodyConfig) {
        const body = new Body({ 
            mass: config.mass, 
            material: this.materials.default, 
            type: config.type || BODY_TYPES.DYNAMIC
        })

        body.allowSleep = true
        body.sleep()
    
        const box = new Box3().setFromObject(config.mesh)
        const size = new Vec3 (
            (box.max.x - box.min.x) / 2,
            (box.max.y - box.min.y) / 2,
            (box.max.z - box.min.z) / 2
        )
        const center = new Vec3(
            (box.max.x + box.min.x) / 2,
            (box.max.y + box.min.y) / 2,
            (box.max.z + box.min.z) / 2
        )
        body.position.copy(center)
    
        switch (config.shapeType) {
            case SHAPE_TYPES.CYLINDER: {
                const radius = size.x
                const height = size.z
                const quaternion = new Quaternion()
                quaternion.setFromAxisAngle(new Vec3(1, 0, 0), Math.PI / 2)
                const shape = new Cylinder(radius, radius, height * 2, 12)
                body.addShape(shape, new Vec3(), quaternion)
    
                break
            }
            case SHAPE_TYPES.BOX: {
            
                const shape = new Box(size)
                body.addShape(shape, new Vec3())
                break
            }
    
        }

        body.addEventListener('collide', () => {
            if (config.collideSound) {
                const sound = this.collideSounds[config.collideSound]
                sound.play()
            }
        })

        this.world.addBody(body)
    
        return body
    
    }
}