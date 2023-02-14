import { Group, Mesh, Vector2, Vector3, Shape, ExtrudeGeometry, MeshBasicMaterial } from 'three'
import Physics from './Physics'
import setPhysics from '@/utils/setPhysics'
import { SHAPE_TYPES } from 'cannon-es'

export default class Shield {
    physics: Physics
    main: Group

    rotation: number
    tl: GSAPTimeline
    constructor (physics: Physics) {
        this.physics = physics

        this.main = new Group()

    }

    private createMesh (modelMesh: Mesh) {

        const shape = new Shape()
        const position = modelMesh.geometry.attributes.position
        const points = []
        for (let i = 0; i < position.count; i++) {
            const point = new Vector3(
                position.array[i * 3 + 0],
                position.array[i * 3 + 1],
                position.array[i * 3 + 2],
            )
            if (!points.length) {
                shape.moveTo(point.x, point.y)
            } else {
                shape.lineTo(point.x, point.y)
            }
            points.push(point)
        }
        const firstPoint = points[0]
        shape.lineTo(firstPoint.x, firstPoint.y)

        const geometry = new ExtrudeGeometry(shape, { depth: 3, bevelEnabled: false })
        const material = new MeshBasicMaterial({color: 0x00ff00, wireframe: true})
        const mesh = new Mesh(geometry, material)
        mesh.position.copy(modelMesh.position)

        return mesh

    }

    add (modelMesh: Mesh) {
        const mesh = this.createMesh(modelMesh)
        this.main.add (mesh)

        setPhysics(mesh, this.physics, SHAPE_TYPES.BOX)
    }

    build (scene: any) {
        const meshs = scene.children
        meshs.forEach((e: Mesh) => {
            setPhysics(e, this.physics)
        })
    }

    update () {
        this.main.rotation.y = this.rotation
    }
}