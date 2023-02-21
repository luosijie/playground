import { DoubleSide, Mesh, ShaderMaterial } from 'three'
import vertexShader from '@/shaders/smoke/vertex.glsl'
import fragmentShader from '@/shaders/smoke/fragment.glsl'

export default class CoffeeSmoke {
    main: Mesh
    material: ShaderMaterial
    constructor () {
        this.main = new Mesh()
        this.material = this.createMaterial()
    }

    private createMaterial () {
        const material = new ShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent: true,
            side: DoubleSide,
            uniforms: {
                uTime: {
                    value: 0
                }
            }
        })
        return material
    }

    add (mesh: Mesh) {
        this.main = mesh
        this.main.material = this.material
    }

    update (elapsedTime: number) {
        this.material.uniforms.uTime.value = elapsedTime
        this.material.needsUpdate
        // this.main.rotation.x = this.rotation
    }
}