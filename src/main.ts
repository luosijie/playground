import './style.scss'

import Loader from './utils/Loader'
import configResources from './config/resources'

import World, { Config }  from './World'

import matcapMaterial from './materials/matcap'
import { MeshMatcapMaterial } from 'three'

const loader = new Loader()

const config: Config = {
    resources: {},
    canvas: document.createElement('canvas'),
    size: {
        width: window.innerWidth,
        height: window.innerHeight
    }
}

let world: World

const canvas = document.querySelector('canvas')
if (canvas instanceof HTMLElement) {
    config.canvas = canvas
    
    world = new World(config)

}

// Load resources
loader.load(configResources)

// Render scene when resources is ready
loader.onLoadEnd(() => {
    const resources = loader.resources
    console.log('reources', loader.resources)
    const modelScene = loader.resources.playground.scene
    modelScene.children.forEach((e: any) => {
        if (e.type === 'Mesh') {
            e.material = matcapMaterial(resources['matcap-red'])
        }
    })
    world.scene.add(modelScene)
})

window.addEventListener('resize', () => {
    world.updateSize(window.innerWidth, window.innerHeight)
})
