import Physics from '@/Elements/Physics'
import { Body, BODY_TYPES, Box, ConvexPolyhedron, Cylinder, ShapeType, SHAPE_TYPES, Trimesh, Vec3 } from 'cannon-es'
import { Box3, BufferAttribute, Mesh, Object3D} from 'three'

import QuickHull from 'quickhull-ts'

export default function (mesh: Mesh, physics: Physics, shapeType: ShapeType = SHAPE_TYPES.BOX) {
    let shape
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

            console.log('ss')
            break
        }
        case SHAPE_TYPES.BOX: 
        
            shape = new Box(size)
            break

    }

    const body = new Body({ mass: 0, shape, material: physics.materials.static, type: BODY_TYPES.DYNAMIC })
    body.allowSleep = false
    // body.sleep()

    // body.sleepSpeedLimit = .01

    if (shapeType !== SHAPE_TYPES.CONVEXPOLYHEDRON) {
        body.position.copy(center)
    }
    physics.world.addBody(body)

}