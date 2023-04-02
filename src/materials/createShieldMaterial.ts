import vertexShader from '@/shaders/shield/vertex.glsl'
import fragmentShader from '@/shaders/shield/fragment.glsl'
import { Color, DoubleSide, ShaderMaterial } from 'three'


export default function (color: Color = new Color('#ffffff')) {
    return new ShaderMaterial({
        transparent: true,
        side: DoubleSide,
        vertexShader,
        fragmentShader,
        uniforms: {
            uColor: {
                value: color
            },
            uHeight: {
                value: 0
            }
        }
    })
}