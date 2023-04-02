import vertexShader from '@/shaders/ground-shadow/vertex.glsl'
import fragmentShader from '@/shaders/ground-shadow/fragment.glsl'
import { Color, ShaderMaterial, Texture } from 'three'

const colors: any = {
    brown: '#692c02',
    beige: '#9b5d2b',
    yellow: '#6c530b',
    green: '#424715',
    blue: '#2e4c5b',
}

export default function (texture: Texture, colorName: string) {
    const color = colors[colorName]

    return new ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        uniforms: {
            uTexture: {
                value: texture,
            },
            uColor: {
                value: new Color(color)
            }
        }
    })
}
