import { Mesh, Object3D, PlaneGeometry, ShaderMaterial, Vector3, Color, Box3 } from 'three'

import vertexShader from '@/shaders/custom-shadow/vertex.glsl'
import fragmentShader from '@/shaders/custom-shadow/fragment.glsl'

export enum CustomShadowType  {
    box = 'box',
    circle = 'circle'
}

export default class CustomShadow {
    source: Object3D

    main: Mesh
    material: ShaderMaterial

    rotation: number

    type: CustomShadowType
    constructor (type: CustomShadowType = CustomShadowType.box) {
        this.type = type

        this.source = new Object3D()

        this.material = new ShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent: true,
            depthWrite: false,
            uniforms: {
                uType: {
                    value: this.type === CustomShadowType.box ? 0. : 1. 
                },

                uColor: {
                    value: new Color('#692c02')
                },
                uOpacity: {
                    value: 0.
                }
            }
        })
        
        const geometry = new PlaneGeometry(1.4, 1.4, 2, 2)
        this.main = new Mesh(geometry, this.material)

    }

    build (source: Object3D) {
        this.source = source

        const box = new Box3().setFromObject(this.source)
        const scaleX = box.max.x - box.min.x
        const scaleY = box.max.y - box.min.y
        
        this.main.scale.set(scaleX, scaleY, 1)

        this.update()
    }

    update () {
        // set position
        const position = this.source.position.clone()
        position.x += .1
        position.y += .1
        this.main.position.copy(position)
        this.main.position.z = 0.02

        // set rotation
        const rotationVector = new Vector3(1, 0, 0)
        rotationVector.applyQuaternion(this.source.quaternion)
        rotationVector.projectOnPlane(new Vector3(0, 0, 1))
        const angle = Math.atan2(rotationVector.y, rotationVector.x)
        this.main.rotation.z = angle

        // set opacity
        let height = this.source.position.z
        height = height > 1 ? 1 : height
        const opacity = 1.0 - height
        this.material.uniforms.uOpacity.value = opacity
    }
}