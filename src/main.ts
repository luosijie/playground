import './style.scss'

import Loader from './utils/Loader'
import configResources from './config/resources'

import World, { Config }  from './World'

import matcapMaterial from './materials/matcap'
import { MeshBasicMaterial, MeshMatcapMaterial, sRGBEncoding } from 'three'

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
    const textureBaked = resources['texture-baked']
    textureBaked.flipY = false
    textureBaked.encoding = sRGBEncoding
    const bakedMaterial = new MeshBasicMaterial({ map: textureBaked })
    // console.log(modelScene.children)
    modelScene.children.forEach((e: any) => {
        if (e.type === 'Mesh') {
            // e.material = matcapMaterial(resources['matcap-brown'])
            e.material = bakedMaterial
            if (e.name.includes('matcap-') || e.name === 'rail') {
                console.log(e.name)
                e.material = matcapMaterial(resources['matcap-brown'])
            } else {
                e.matcapMaterial = bakedMaterial
            }
        }
    })
    world.scene.add(modelScene)
})

window.addEventListener('resize', () => {
    world.updateSize(window.innerWidth, window.innerHeight)
})
