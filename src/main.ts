import './style.scss'

import Loader from './utils/Loader'
import configResources from './config/resources'

import World from './Elements/World'
import { Config } from './Types'

const loader = new Loader()

// Config ready to create world
const config: Config = {
    width: window.innerWidth,
    height: window.innerHeight,
    canvas: document.createElement('canvas')
}

let world: World

// Init canvas
const canvas = document.querySelector('canvas')
if (canvas) {
    config.canvas = canvas
    world = new World(config)
}

// Load resources
loader.load(configResources)

// Render world elements when resources is ready
loader.onLoadEnd(resources => {
    world.build(resources)
})

window.addEventListener('resize', () => {
    world.updateSize(window.innerWidth, window.innerHeight)
})
