import Physics from '@/Elements/Physics'
import { Body, BODY_TYPES, Box, Cylinder, Quaternion, ShapeType, SHAPE_TYPES, Vec3 } from 'cannon-es'
import { Box3, Mesh} from 'three'

export default function (mesh: Mesh, physics: Physics, shapeType: ShapeType = SHAPE_TYPES.BOX) {
    const body = new Body({ mass: 0, material: physics.materials.static, type: BODY_TYPES.DYNAMIC })

    const box = new Box3().setFromObject(mesh)
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

    switch (shapeType) {
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
    
    // body.sleep()

    // body.sleepSpeedLimit = .01

    // body.position.copy(center)
    physics.world.addBody(body)

}