import { Mesh, Object3D, PlaneGeometry, ShaderMaterial, Vector3, Color } from 'three'

import vertexShader from '@/shaders/custom-shadow/vertex.glsl'
import fragmentShader from '@/shaders/custom-shadow/fragment.glsl'

export default class CustomShadow {
    source: Object3D

    main: Mesh
    rotation: number
    constructor () {
        this.source = new Object3D()

        this.main = this.createShadow(new Color('#692c02'))
        this.rotation = 0

        const v = new Vector3(1, 1, 1)
        v.projectOnPlane(new Vector3(0, 0, 1))
        console.log('v', v)
    }

    private createShadow (color: Color) {
        const geometry = new PlaneGeometry(10, 10, 2, 2)
        const material = new ShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent: true,
            uniforms: {
                uColor: {
                    value: color
                }
            }
        })
        return new Mesh(geometry, material)
    }

    build (source: Object3D) {
        this.source = source
    }

    update () {
        this.main.position.copy(this.source.position)

        const rotationVector = new Vector3(1, 0, 0)
        rotationVector.applyQuaternion(this.source.quaternion)
        rotationVector.projectOnPlane(new Vector3(0, 0, 1))

        const angle = Math.atan2(rotationVector.y, rotationVector.x)

        // rotationVector.
        this.main.position.z = 0.01
        this.main.rotation.z = angle
    }
}