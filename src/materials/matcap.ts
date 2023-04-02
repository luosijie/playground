import vertexShader from '@/shaders/matcap/vertex.glsl'
import fragmentShader from '@/shaders/matcap/fragment.glsl'
import { ShaderMaterial, Texture } from 'three'

export default function (texture: Texture) {
    return new ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            uTexture: {
                value: texture
            }
        }
    })
}