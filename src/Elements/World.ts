import { AxesHelper, Clock, Scene, sRGBEncoding, Vector3, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { Config } from '../Types'

import matcapMaterial from '@/materials/matcap'
import groundShadowMaterial  from '@/materials/groundShadow'

import Camera from './Camera'
import RailCar from './RailCar'
import Car from './Car'
import Physics, { CollideSoundName } from './Physics'
import Repeats from './Repeats'
import Windmill from './Windmill'
import Carousel from './Carousel'
import Ship from './Ship'
import DropRotation from './DropRotation'
import Ferris from './Ferris'
import DropUp from './DropUp'

import CannonDebugger from 'cannon-es-debugger'
import Shields from './Shields'
import checkDev from '@/utils/checkDev'
import Trees from './Trees'
import Bricks from './Bricks'
import { SHAPE_TYPES } from 'cannon-es'

import { gsap } from 'gsap'
import CoffeeSmoke from './CoffeeSmoke'

// import Sound from './Sound'

export default class World {
    isDev: boolean
    isReady: boolean
    isActive: boolean

    width: number
    height: number

    clock: Clock

    controls: OrbitControls

    canvas: HTMLCanvasElement
    renderer: WebGLRenderer
    scene: Scene
    camera: Camera

    physics: Physics
    // sound: Sound

    sun: Vector3

    // Elements in world
    repeats: Repeats
    railCar: RailCar
    windmill: Windmill
    carousel: Carousel
    ship: Ship
    dropRotation: DropRotation
    dropUp: DropUp
    ferris: Ferris
    car: Car

    coffeeSmoke: CoffeeSmoke

    shields: Shields
    trees: Trees
    bricks: Bricks

    cannonDebugger: any

    constructor (config: Config) {
        this.isDev = checkDev()
        this.isReady = false
        this.isActive = false

        this.width = config.width
        this.height = config.height

        this.clock = new Clock()

        this.canvas = config.canvas
        this.renderer = this.createRenderer()
        this.scene = new Scene()
        this.camera = new Camera(this.width, this.height)
        this.controls = new OrbitControls(this.camera.main, this.canvas)
        this.controls.enabled = false
        
        this.sun = new Vector3(-15.5866, -21.5806, 16.9775)
    
        this.railCar = new RailCar()
        this.windmill = new Windmill()
        this.carousel = new Carousel()
        this.ship = new Ship()
        this.dropRotation = new DropRotation()
        this.dropUp = new DropUp()
        this.ferris = new Ferris()

        // this.sound = new Sound()
        // this.sound.play('one')
        // this.sound.play()
        this.coffeeSmoke = new CoffeeSmoke()

        this.physics = new Physics()
        this.repeats = new Repeats(this.physics)
        this.shields = new Shields(this.physics)
        this.trees = new Trees(this.physics)
        this.car = new Car(this.physics)
        this.bricks = new Bricks(this.physics)
        
        this.cannonDebugger = CannonDebugger(this.scene, this.physics.world)

        this.init()
        
    }

    private init () { 
        if (this.isDev) {
            this.controls.enabled = true
            const axesHelper = new AxesHelper(50)
            this.scene.add(axesHelper)
        }
    }

    private createRenderer () {
        const renderer = new WebGLRenderer({ 
            canvas: this.canvas,
            antialias: true,  
            alpha: true 
        })
        renderer.setSize( this.width, this.height)
        renderer.setAnimationLoop( this.render.bind(this) )
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.outputEncoding = sRGBEncoding

        // renderer.outputEncoding = sRGBEncoding
        return renderer
    }

    // Passed to renderer.setAnimationLoop
    private render () {
        // const elapsedTime = this.clock.getElapsedTime()
        this.physics.world.fixedStep()
        
        if (this.isReady) {
            this.car.update()
            this.windmill.update()
            this.carousel.update()
            this.ship.update()
            this.dropRotation.update()
            this.dropUp.update()
            this.ferris.update()
            this.railCar.update()
            this.bricks.update()
            this.coffeeSmoke.update(this.clock.getElapsedTime())
            !this.isDev && this.camera.update()
        } 
        
        if (this.isActive && !this.isDev) {
            this.camera.follow(this.car.body.position)
        }

        if (this.isDev) {
            this.cannonDebugger.update()
            this.controls.update()
        }

        // this.controls.update()
        this.renderer.render( this.scene, this.camera.main )

    }

    // Build world elements with resources
    build (resources: any) {
        console.log('resources', resources)

        const modelPlayground = resources['model-playground'].scene
        const modelCarScene = resources['model-car'].scene

        const dataRailPoints = resources['data-rail-points']
        this.railCar.addPathLine(dataRailPoints)

        const models = [...modelPlayground.children, ...modelCarScene.children]
        models.forEach((e: any) => {
            const data = e.userData

            // set matcap color
            if (data.matcap) {
                e.material = matcapMaterial(resources[`matcap-${data.matcap}`])
            }

            // set shadow
            if (data['shadow-color']) {
                e.material = groundShadowMaterial(resources['texture-shadow'], data['shadow-color'])
            }

            if (data.name === 'sun') {
                console.log('data', e)
            }

            // models to dunplicate
            if (this.repeats.contains(data.name)) {
                this.repeats.add(data.name, e)
            }

            // modles to animate
            if (data.name === 'rail-car') {
                this.railCar.add(e)
            }

            if (data.name === 'windmill') {
                this.windmill.add(e)
            }

            if (data.name === 'carousel-rotation') {
                this.carousel.add(e)
            }

            if (data.name.includes('ship')) {
                this.ship.add(e)
            }

            if (data.name.includes('drop-rotation')) {
                this.dropRotation.add(e)
            }

            if (data.name.includes('drop-up-seat')) {
                this.dropUp.add(e)
            }

            if (data.name.includes('ferris')) {
                this.ferris.add(e)
            }

            if (data.physics === 'static') {
                this.physics.createBody({ mesh: e, mass: 0, shapeType: SHAPE_TYPES.BOX, collideSound: CollideSoundName.Wall })
            }

            if (data.name === 'area') {
                this.shields.add(e)
            }

            if (data.name.includes('tree-')) {
                this.trees.add(e)
            }

            if (data.name === 'coffee-smoke') {
                this.coffeeSmoke.add(e)
            }
            
        })
        this.scene.add(modelPlayground)

        this.repeats.build()
        this.scene.add(this.repeats.main)

        this.carousel.build()
        this.scene.add(this.carousel.main)

        this.ship.build()
        this.scene.add(this.ship.main)

        this.dropRotation.build()
        this.scene.add(this.dropRotation.main)

        this.dropUp.build()
        this.scene.add(this.dropUp.main)
        
        this.ferris.build()
        this.scene.add(this.ferris.main)

        this.scene.add(this.shields.main)

        // init rail car
        this.railCar.build()
        this.scene.add(this.railCar.main)

        // init car
        this.car.build(modelCarScene)
        this.scene.add(this.car.main)

        this.bricks.add(resources)

        this.isReady = true

        this.camera.ready(() => {
            gsap.to('.actions', { top: 0})
        })

    }

    active () {
        gsap.to('.actions', { top: -70 })
        this.camera.active(this.car.body.position, () => {

            this.bricks.build()
            this.scene.add(this.bricks.main)

            this.trees.build()
            this.scene.add(this.trees.main)

            this.car.setControls()
        
            this.isActive = true
            console.log('world is active')
        })
        // this.isActive = true
    }

    refresh () {
        this.isActive = false
        this.camera.ready(() => {
            gsap.to('.actions', { top: 0 })
        })
        // console.log('need refresh')
    }

    // Update canvas size when window resizing
    updateSize (width: number, height: number) {
        
        this.width = width
        this.height = height

        // update camera        
        this.camera.updateSize(width, height)
        
        // update renderer
        this.renderer.setSize(width, height)
        
    }
    
}