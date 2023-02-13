import { PerspectiveCamera, Vector3 } from 'three'

// Define the relative position of the car
const cameraPosition = new Vector3(81.8107, -68.4092, 96.8815).normalize()

export default class Camera {
    width: number
    height: number
    main: PerspectiveCamera
    constructor (width: number, height: number) {
        const camera = new PerspectiveCamera( 40, width / height, 0.1, 1000 )
        camera.up.z = 1
        camera.up.x = 0
        camera.up.y = 0
        // const multiple = 40
        
        // camera.position.copy(cameraPosition.clone().normalize().multiplyScalar(multiple))
        camera.lookAt(new Vector3())

        this.main = camera
    }

    updateSize (width:number, height:number) {

        this.main.aspect = width / height
        this.main.updateProjectionMatrix()
    }

    follow (target: Vector3) {
        this.main.position.copy(target).add(cameraPosition.clone().multiplyScalar(26))
        this.main.lookAt(target)
        this.main.updateProjectionMatrix()
    }
}