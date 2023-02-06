import vertexShader from '@/shaders/default/vertex.glsl?raw'
import fragmentShader from '@/shaders/default/fragment.glsl?raw'
import { ShaderMaterial } from 'three'

export default new ShaderMaterial({
    vertexShader,
    fragmentShader
})