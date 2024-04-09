import { LoaderType } from '../utils/Loader'

const rootPath = import.meta.env.VITE_SUB_DOMAIN || ''


export default [
    { name: 'data-rail-points', type: LoaderType.PLY, path: rootPath + 'models/rail-points.ply'},
    { name: 'texture-shadow', type: LoaderType.Texture, path: rootPath + 'textures/shadows.jpg'},
    { name: 'model-playground', type: LoaderType.GLTF, path: rootPath + 'models/playground.glb'},
    { name: 'model-bricks', type: LoaderType.GLTF, path: rootPath + 'models/bricks.glb'},
    { name: 'model-car', type: LoaderType.GLTF, path: rootPath + 'models/car.glb'},
    { name: 'model-physics-static', type: LoaderType.GLTF, path: rootPath + 'models/physics-static.glb'},
    { name: 'matcap-black', type: LoaderType.Texture, path: rootPath + 'matcaps/black.png'},
    { name: 'matcap-blue-light', type: LoaderType.Texture, path: rootPath + 'matcaps/blue-light.png'},
    { name: 'matcap-blue-lighter', type: LoaderType.Texture, path: rootPath + 'matcaps/blue-lighter.png'},
    { name: 'matcap-blue', type: LoaderType.Texture, path: rootPath + 'matcaps/blue.png'},
    { name: 'matcap-brown-dark', type: LoaderType.Texture, path: rootPath + 'matcaps/brown-dark.png'},
    { name: 'matcap-brown-light', type: LoaderType.Texture, path: rootPath + 'matcaps/brown-light.png'},
    { name: 'matcap-brown-lighter', type: LoaderType.Texture, path: rootPath + 'matcaps/brown-lighter.png'},
    { name: 'matcap-brown', type: LoaderType.Texture, path: rootPath + 'matcaps/brown.png'},
    { name: 'matcap-eye', type: LoaderType.Texture, path: rootPath + 'matcaps/eye.png'},
    { name: 'matcap-green', type: LoaderType.Texture, path: rootPath + 'matcaps/green.png'},
    { name: 'matcap-green-light', type: LoaderType.Texture, path: rootPath + 'matcaps/green-light.png'},
    { name: 'matcap-pink', type: LoaderType.Texture, path: rootPath + 'matcaps/pink.png'},
    { name: 'matcap-purple', type: LoaderType.Texture, path: rootPath + 'matcaps/purple.png'},
    { name: 'matcap-purple-dark', type: LoaderType.Texture, path: rootPath + 'matcaps/purple-dark.png'},
    { name: 'matcap-purple-light', type: LoaderType.Texture, path: rootPath + 'matcaps/purple-light.png'},
    { name: 'matcap-red', type: LoaderType.Texture, path: rootPath + 'matcaps/red.png'},
    { name: 'matcap-red-dark', type: LoaderType.Texture, path: rootPath + 'matcaps/red-dark.png'},
    { name: 'matcap-red-light', type: LoaderType.Texture, path: rootPath + 'matcaps/red-light.png'},
    { name: 'matcap-white', type: LoaderType.Texture, path: rootPath + 'matcaps/white.png'},
    { name: 'matcap-yellow', type: LoaderType.Texture, path: rootPath + 'matcaps/yellow.png'},
    { name: 'matcap-yellow-dark', type: LoaderType.Texture, path: rootPath + 'matcaps/yellow-dark.png'},
    { name: 'matcap-yellow-light', type: LoaderType.Texture, path: rootPath + 'matcaps/yellow-light.png'},
    { name: 'matcap-eye', type: LoaderType.Texture, path: rootPath + 'matcaps/eye.png'},
]