import { ArrowHelper, BufferGeometry, CurvePath, Object3D, Line, LineBasicMaterial, LineCurve3, Mesh, Scene, Vector3 } from 'three'
import { VertexNormalsHelper } from 'three/examples/jsm/helpers/VertexNormalsHelper.js'

const SPEED = 0.0008
export default class RailCar {
    models: Array<Mesh>
    path: CurvePath<any>
    main: Object3D
    progress: number
    constructor () {
        this.models = []
        this.main = new Object3D()
        this.path = new CurvePath()
        this.progress = 1
    }

    // Add relative mesh to models
    add (object: Mesh ) {
        this.models.push(object)
    }

    addPathLine (geometry: BufferGeometry) {
        console.log('--', geometry)
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

        const lastLine = new LineCurve3(points[nums - 1], points[0])
        this.path.add(lastLine)
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
        
        // set axis-x rotation
        const randY = new Vector3(0, 0, 1).angleTo(tangent)
        const axis = new Vector3(0, 1, 0)
        axis.applyAxisAngle(new Vector3(0, 0, 1), this.main.rotation.z)
        this.main.setRotationFromAxisAngle(axis, randY - Math.PI / 2)

        // set axis-z rotation
        const tangentZ = tangent.clone()
        tangentZ.z = 0
        const randZ = new Vector3(1, 0, 0).angleTo(tangentZ)
       
        if (new Vector3(1, 0, 0).cross(tangent).z > 0) {
            this.main.rotation.z = Math.PI + randZ
        } else {
            this.main.rotation.z = -randZ
        }

        this.main.position.copy(curentPoint)
    }
}