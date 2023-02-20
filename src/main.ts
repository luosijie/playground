import './style.scss'

import { gsap } from 'gsap'

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

// Load progress
const percent = document.querySelector('.percent')
loader.onFileLoaded(() => {
    const value: number = loader.totalSuccess / loader.total * 100
    if (percent instanceof HTMLElement) {
        percent.innerText = String(Math.round(value))
    }
})

// Render world elements when resources is ready
loader.onLoadEnd(resources => {
    gsap.to('.loading', { opacity: 0 })

    world.build(resources)

    const goButton = document.querySelector('.go')
    goButton?.addEventListener('click', () => {
        world.active()
    })
})

window.addEventListener('resize', () => {
    world.updateSize(window.innerWidth, window.innerHeight)
})
