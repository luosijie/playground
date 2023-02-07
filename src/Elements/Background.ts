import { Mesh, PlaneGeometry, Color, DataTexture, RGBAFormat, LinearFilter, ShaderMaterial } from 'three'
import vertexShader from '@/shaders/background/vertex.glsl'
import fragmentShader from '@/shaders/background/fragment.glsl'
export default class Background {

    colors: Array<Color>
    main: Mesh

    constructor (colors: Array<Color>) {
        this.colors = colors

        const geometry = new PlaneGeometry(2, 2, 2)
        const material = this.createMaterial()

        this.main = new Mesh(geometry, material)
    }

    createMaterial () {
        const topLeft = this.colors[0]
        const topRight = this.colors[1]
        const bottomRight = this.colors[2]
        const bottomLeft = this.colors[3]

        const data = new Uint8Array([
            Math.round(bottomLeft.r * 255), Math.round(bottomLeft.g * 255), Math.round(bottomLeft.b * 255), 1,
            Math.round(bottomRight.r * 255), Math.round(bottomRight.g * 255), Math.round(bottomRight.b * 255), 1,
            Math.round(topLeft.r * 255), Math.round(topLeft.g * 255), Math.round(topLeft.b * 255), 1,
            Math.round(topRight.r * 255), Math.round(topRight.g * 255), Math.round(topRight.b * 255), 1
        ])
        
        const texture = new DataTexture(data, 2, 2, RGBAFormat)
        texture.magFilter = LinearFilter
        texture.needsUpdate = true
        
        const uniforms = {
            tBackground: { value: texture }
        }

        const material = new ShaderMaterial({
            wireframe: false,
            transparent: false,
            uniforms,
            vertexShader,
            fragmentShader
        })
        
        return material
    }
}