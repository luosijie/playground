import { LoaderType } from '../utils/Loader'
export default [
    { name: 'model-playground', type: LoaderType.GLTF, path: '/models/playground.glb'},
    { name: 'model-rail-car', type: LoaderType.GLTF, path: '/models/rail-car.glb'},
    { name: 'model-car', type: LoaderType.GLTF, path: '/models/car.glb'},
    { name: 'model-physics-static', type: LoaderType.GLTF, path: '/models/physics-static.glb'},
    { name: 'texture-baked', type: LoaderType.Texture, path: '/textures/baked.jpg'},
    { name: 'matcap-beige', type: LoaderType.Texture, path: '/matcaps/beige.png'},
    { name: 'matcap-black', type: LoaderType.Texture, path: '/matcaps/black.png'},
    { name: 'matcap-green', type: LoaderType.Texture, path: '/matcaps/green.png'},
    { name: 'matcap-white', type: LoaderType.Texture, path: '/matcaps/white.png'},
    { name: 'matcap-blue', type: LoaderType.Texture, path: '/matcaps/blue.png'},
    { name: 'matcap-brown', type: LoaderType.Texture, path: '/matcaps/brown.png'},
    { name: 'matcap-gold', type: LoaderType.Texture, path: '/matcaps/gold.png'},
    { name: 'matcap-red', type: LoaderType.Texture, path: '/matcaps/red.png'},
    { name: 'matcap-metal', type: LoaderType.Texture, path: '/matcaps/metal.png'}
]