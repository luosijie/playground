import { Group, Mesh, Vector2, Vector3, Shape, ExtrudeGeometry, MeshBasicMaterial } from 'three'
import Physics from './Physics'
import setPhysics from '@/functions/setPhysics'


export default class Shield {
    physics: Physics
    main: Group

    rotation: number
    tl: GSAPTimeline
    constructor (physics: Physics) {
        this.physics = physics

        this.main = new Group()

    }

    add (mesh: Mesh) {

        const shape = new Shape()
        const position = mesh.geometry.attributes.position
        const points = []
        for (let i = 0; i < position.count; i++) {
            const point = new Vector3(
                position.array[i * 3 + 0],
                position.array[i * 3 + 1],
                position.array[i * 3 + 2],
            )
            points.push(point)

            shape.lineTo(point.x, point.y)
        }
        const firstPoint = points[0]
        shape.lineTo(firstPoint.x, firstPoint.y)

        const geometry = new ExtrudeGeometry(shape, { depth: 3, bevelEnabled: false })
        const material = new MeshBasicMaterial({color: 0x00ff00, wireframe: true})
        const shapMesh = new Mesh(geometry, material)
        shapMesh.position.copy(mesh.position)
        this.main.add (shapMesh)
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