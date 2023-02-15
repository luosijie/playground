import Physics from '@/Elements/Physics'
import { Body, BodyType, BODY_TYPES, Box, Cylinder, Quaternion, ShapeType, SHAPE_TYPES, Vec3 } from 'cannon-es'
import { Box3, Mesh} from 'three'

interface Config {
    mesh: Mesh
    physics: Physics
    shapeType: ShapeType
    mass: number
    type?: BodyType
}

export default function (config: Config) {
    const body = new Body({ 
        mass: config.mass, 
        material: config.physics.materials.default, 
        type: config.type || BODY_TYPES.DYNAMIC 
    })

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

    switch (config.shapeType) {
        case SHAPE_TYPES.CYLINDER: {
            const radius = size.x
            const height = size.z
            const quaternion = new Quaternion()
            quaternion.setFromAxisAngle(new Vec3(1, 0, 0), Math.PI / 2)
            const shape = new Cylinder(radius, radius, height * 2, 12)
            body.addShape(shape, center, quaternion)

            break
        }
        case SHAPE_TYPES.BOX: {
        
            const shape = new Box(size)
            body.addShape(shape, center)
            break
        }

    }

    config.physics.world.addBody(body)

    return body

}