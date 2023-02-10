import { ArrowHelper, BufferGeometry, CurvePath, Group, Line, LineBasicMaterial, LineCurve3, Mesh, Scene, Vector3 } from 'three'
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js'

const SPEED = 0.001
const UP = new Vector3(0, 0, 1)
export default class RailCar {
    models: Array<Mesh>
    path: CurvePath<any>
    main: Group
    progress: number
    constructor () {
        this.models = []
        this.main = new Group()
        this.path = new CurvePath()
        this.progress = 1
    }

    // Add relative mesh to models
    add (object: Mesh ) {
        this.models.push(object)
    }

    addPathLine (geometry: BufferGeometry, scene: Scene) {
        const position = geometry.attributes.position.array
        const nums = 52
        const points = []
        for (let i = 0; i < nums; i++) {
            const p = new Vector3(
                position[(i * 3 + 0)],
                position[(i * 3 + 1)],
                position[(i * 3 + 2)]
            )
            points.push(p)
        }

        for (let i = 0; i < nums - 1; i++) {
            const line = new LineCurve3(points[i], points[i + 1])
            this.path.add(line)
        }

        for (let i = 0; i < 400 - 1; i++) {
            const frictionStart = i / 400
            const point = this.path.getPoint(frictionStart)
            const tangent = this.path.getTangent(frictionStart)
            tangent.negate()
            const arrow = new ArrowHelper(tangent, point, 2, 0xff0000)
            scene.add(arrow)
        }
    }

    // Param pathpoints : help to generate rail path
    build () {

        // const material = new PointsMaterial({ color: 0x888888, size: 2 })
        // console.log('22', pathPoints)
        // const points = new Points(pathPoints, material)

        const defaultPosition = this.models[0].position.clone()
        this.models.forEach(e => {
            e.position.set(0, 0, 0)
            this.main.add(e)
        })
        this.main.position.copy(defaultPosition)

    }

    update () {
        this.progress -= SPEED
        if (this.progress < 0) this.progress = 1

        const curentPoint = this.path.getPoint(this.progress)
        const tangent = this.path.getTangent(this.progress)
        tangent.negate()
        
        // const axis = new Vector3().crossVectors(UP, tangent).normalize()
        // const randY = Math.acos(UP.dot(tangent))
        const randY = new Vector3(0, 0, 1).angleTo(tangent)
        const t = tangent.clone()
        t.z = 0
        const randZ = new Vector3(1, 0, 0).angleTo(t)
        console.log('tangent', parseInt(randZ / Math.PI * 180), tangent)

        // const angle = Math.cross
        // this.main.quaternion.setFromAxisAngle(axis, rand)
        // this.main.rotation.y = randY - Math.PI / 2
        this.main.rotation.z = -randZ

        this.main.position.copy(curentPoint)
        // this.main.lookAt(targetPPoint)

    }
}