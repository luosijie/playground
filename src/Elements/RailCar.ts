import { BufferGeometry, CurvePath, Object3D, LineCurve3, Mesh, Vector3 } from 'three'

const SPEED = 0.0008
const NUMS = 6
export default class RailCar {
    models: Array<Mesh>
    path: CurvePath<any>
    main: Object3D
    cars: Array<Object3D>
    progress: number
    constructor () {
        this.models = []
        this.cars = []
        this.main = new Object3D()
        this.path = new CurvePath()
        this.progress = 1
    }

    // Add relative mesh to models
    add (object: Mesh ) {
        this.models.push(object)
    }

    addPathLine (geometry: BufferGeometry) {
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
        const car = new Object3D()
        const defaultPosition = this.models[0].position.clone()
        this.models.forEach(e => {
            e.position.set(0, 0, 0)
            car.add(e)
        })
        car.position.copy(defaultPosition)
        this.main.add(car)
        this.cars.push(car)

        for (let i = 1; i < NUMS; i++) {
            const nCar = car.clone()
            this.cars.push(nCar)
            this.main.add(nCar)
        }
    }

    update () {
        this.progress -= SPEED
        if (this.progress < 0) this.progress = 1

        for (let i = 0; i < this.cars.length; i++) {
            const car = this.cars[i]
            let progress = this.progress - i * SPEED * 20
            if (progress < 0) progress = 1 + (this.progress - i * SPEED * 20)

            const curentPoint = this.path.getPoint(progress)
            const tangent = this.path.getTangent(progress)
            tangent.negate()
        
            // set axis-y rotation
            const randY = new Vector3(0, 0, 1).angleTo(tangent)
            const axis = new Vector3(0, 1, 0)
        
            axis.applyAxisAngle(new Vector3(0, 0, 1), car.rotation.z)
            car.setRotationFromAxisAngle(axis, randY - Math.PI / 2)
    
            // set axis-z rotation
            const tangentZ = tangent.clone()
            tangentZ.z = 0
            const randZ = new Vector3(1, 0, 0).angleTo(tangentZ)
           
            if (new Vector3(1, 0, 0).cross(tangent).z > 0) {
                car.rotation.z = randZ
            } else {
                car.rotation.z = -randZ
            }
    
            car.position.copy(curentPoint)

        }
    }
}