import { Mesh, PlaneGeometry, ShaderMaterial, Texture, Vector2, Vector4 } from 'three'

import vertex from './shaders/vertex.glsl'
import fragment from './shaders/fragment.glsl'

// import texture from '/images/texture.jpg'
// import { Size } from './Types'

import gsap from 'gsap'

export default class Plane {
    img: HTMLImageElement
    mesh: Mesh
    geometry: PlaneGeometry
    material: ShaderMaterial
    showing: boolean
    duration: number
    constructor (img: HTMLImageElement) {
        this.img = img

        this.showing = false
        this.duration = 0.4

        const image = new Image()
        image.src = img.src
        const texture = new Texture(image)
        texture.needsUpdate = true

        const bounds = img.getBoundingClientRect()
        
        this.geometry = new PlaneGeometry(bounds.width, bounds.height, 50, 50)
        this.material = new ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: {
                uCorners: {
                    value: new Vector4(0, 0, 0, 0)
                },
                uSize: {
                    value: new Vector2(bounds.width, bounds.height)
                },
                uWindowSize: {
                    value: new Vector2(window.innerWidth, window.innerHeight)
                },
                uTexture: {
                    value: texture
                }
            }
        })

        this.mesh = new Mesh(this.geometry, this.material)

        this.updatePosition()

    }

    updatePosition () {
        const bounds = this.img.getBoundingClientRect()
        this.mesh.position.x = bounds.left  - window.innerWidth / 2 + bounds.width / 2
        this.mesh.position.y = -(bounds.height  - window.innerWidth / 2 + bounds.height / 2)

    }

    show () {
        const tl = gsap.timeline()
        tl.to(this.material.uniforms.uCorners.value, {
            x: 1,
            duration: this.duration
        }).to(this.material.uniforms.uCorners.value, {
            y: 1,
            duration: this.duration
        }, 0.1).to(this.material.uniforms.uCorners.value, {
            z: 1,
            duration: this.duration
        }, 0.2).to(this.material.uniforms.uCorners.value, {
            w: 1,
            duration: this.duration
        }, 0.3)
    }
    hide () {
        const tl = gsap.timeline()
        tl.to(this.material.uniforms.uCorners.value, {
            x: 0,
            duration: this.duration
        }).to(this.material.uniforms.uCorners.value, {
            y: 0,
            duration: this.duration
        }, 0.1).to(this.material.uniforms.uCorners.value, {
            z: 0,
            duration: this.duration
        }, 0.2).to(this.material.uniforms.uCorners.value, {
            w: 0,
            duration: this.duration
        }, 0.3)

    }
}