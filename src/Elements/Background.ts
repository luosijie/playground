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
            Math.floor(bottomLeft.r * 255), Math.floor(bottomLeft.g * 255), Math.floor(bottomLeft.b * 255), 255,
            Math.floor(bottomRight.r * 255), Math.floor(bottomRight.g * 255), Math.floor(bottomRight.b * 255), 255,
            Math.floor(topLeft.r * 255), Math.floor(topLeft.g * 255), Math.floor(topLeft.b * 255), 255,
            Math.floor(topRight.r * 255), Math.floor(topRight.g * 255), Math.floor(topRight.b * 255), 255,
        ])
        
        const texture = new DataTexture(data, 2, 2, RGBAFormat)
        texture.magFilter = LinearFilter
        texture.needsUpdate = true

        const material = new ShaderMaterial({
            wireframe: false,
            transparent: false,
            uniforms: {
                uBackground: { value: texture }
            },
            vertexShader,
            fragmentShader
        })
        
        return material
    }
}