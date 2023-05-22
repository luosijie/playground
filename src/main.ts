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

// Init World
const canvas = document.querySelector('canvas')
if (canvas) {
    config.canvas = canvas
    world = new World(config)
}

/** Load process start */
loader.load(configResources)

const percent = document.querySelector('.percent')
loader.onFileLoaded(() => {
    const value: number = loader.totalSuccess / loader.total * 100
    if (percent instanceof HTMLElement) {
        percent.innerText = String(Math.round(value))
    }
})

loader.onLoadEnd(resources => {
    gsap.to('.loading', { opacity: 0, onComplete: () => {
        world.build(resources)
    } })

})

/** Load process end */

window.addEventListener('resize', () => {
    world.updateSize(window.innerWidth, window.innerHeight)
})

/***************************************************************
 * Buttons event binding
 **************************************************************/

const goButton = document.querySelector('button.go')
goButton?.addEventListener('click', () => {
    world.active()
})
    
const showInfoButton = document.querySelector('button.show-info')
showInfoButton?.addEventListener('click', () => {
    gsap.to('.info', { opacity: 1, display: 'flex' })
})

const closeInfoButton = document.querySelector('button.close-info')
closeInfoButton?.addEventListener('click', () => {
    gsap.to('.info', { opacity: 0, display: 'none' })
})

