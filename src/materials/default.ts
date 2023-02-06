import vertexShader from '../shaders/vertex.glsl?raw'
import fragmentShader from '../shaders/fragment.glsl?raw'
import { ShaderMaterial } from 'three'

export default new ShaderMaterial({
    vertexShader,
    fragmentShader
})