import Physics from '@/Elements/Physics'
import { Body, Box, Cylinder, Vec3 } from 'cannon-es'
import { Box3, Mesh} from 'three'

export default function (mesh: Mesh, physics: Physics) {
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

    const shape = new Box(size)
    const boxBody = new Body({ mass: 0, shape, material: physics.materials.static })
    boxBody.allowSleep = true
    boxBody.sleepSpeedLimit = .01
    boxBody.position.copy(center)
    // boxBody.sleep()
    physics.world.addBody(boxBody)

}