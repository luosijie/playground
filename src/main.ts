import './style.scss'

import Loader from './utils/Loader'
import resources from './config/resources'

import World, { Config }  from './World'

import defaultMaterial from './materials/default'

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

loader.load(resources)
loader.onLoadEnd(() => {
    const modelScene = loader.resources.playground.scene
    modelScene.children.forEach((e: any) => {
        if (e.type === 'Mesh') {
            e.material = defaultMaterial
            console.log('mesh', e)
        }
    })
    world.scene.add(modelScene)
    console.log(loader.resources)
})

window.addEventListener('resize', () => {
    world.updateSize(window.innerWidth, window.innerHeight)
})
