import vertexShader from '@/shaders/default/vertex.glsl'
import fragmentShader from '@/shaders/default/fragment.glsl'
import { ShaderMaterial } from 'three'

export default new ShaderMaterial({
    vertexShader,
    fragmentShader
})