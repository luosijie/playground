import { AxesHelper, Clock, Color, PerspectiveCamera, Points, PointsMaterial, Scene, Vector3, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import Background from './Background'

import { Config } from '../Types'

import matcapMaterial from '@/materials/matcap'

import RailCar from './RailCar'
import Car from './Car'
import Physics from './Physics'
import Repeats from './Repeats'
import Windmill from './Windmill'
import Carousel from './Carousel'
import Ship from './Ship'
import DropRotation from './DropRotation'
import Ferris from './Ferris'
import DropUp from './DropUp'

export default class World {
    isReady: boolean

    width: number
    height: number

    clock: Clock

    controls: OrbitControls

    canvas: HTMLCanvasElement
    renderer: WebGLRenderer
    scene: Scene
    camera: PerspectiveCamera

    physics: Physics

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

    constructor (config: Config) {
        this.isReady = false

        this.width = config.width
        this.height = config.height

        this.clock = new Clock()

        this.canvas = config.canvas
        this.renderer = this.createRenderer()
        this.scene = new Scene()
        this.camera = this.createCamera()
        this.controls = new OrbitControls(this.camera, this.canvas)
        
        this.railCar = new RailCar()
        this.repeats = new Repeats()
        this.windmill = new Windmill()
        this.carousel = new Carousel()
        this.ship = new Ship()
        this.dropRotation = new DropRotation()
        this.dropUp = new DropUp()
        this.ferris = new Ferris()

        this.physics = new Physics()
        this.car = new Car(this.physics)
        
        this.init()

        const axesHelper = new AxesHelper(50)
        this.scene.add(axesHelper)
    }

    private init () { 
        this.updateCamera()
        this.setBackground()
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

        // renderer.outputEncoding = sRGBEncoding
        return renderer
    }

    private createCamera () {
        const camera = new PerspectiveCamera( 40, this.width / this.height, 0.01, 1000 )
        camera.up.z = 1
        camera.up.x = 0
        camera.up.y = 0
        const multiple = 40
        
        camera.position.copy(new Vector3(1.135 * multiple,  -1.45 * multiple, 1.15 * multiple))
        return camera
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
        } 

        this.controls.update()
        this.renderer.render( this.scene, this.camera )
    }

    private updateCamera () {

        this.camera.aspect = this.width / this.height
        this.camera.updateProjectionMatrix()
    }

    private setBackground () {
        const colors = [ new Color('#de9362'), new Color('#dd9b6a'), new Color('#d79a6f'), new Color('#d9976c') ]
        const background = new Background(colors)
        this.scene.add(background.main)
    }

    // Build world elements with resources
    build (resources: any) {

        const modelPlayground = resources['model-playground'].scene
        const modelCarScene = resources['model-car'].scene
        const models = modelPlayground.children

        const dataRailPoints = resources['data-rail-points']
        this.railCar.addPathLine(dataRailPoints)

        models.forEach((e: any) => {
            const data = e.userData

            // set matcap color
            if (data.matcap) {
                e.material = matcapMaterial(resources[`matcap-${data.matcap}`])
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

        // init rail car
        this.railCar.build()
        this.scene.add(this.railCar.main)

        // init car
        this.car.build(modelCarScene)
        this.scene.add(this.car.main)

        this.isReady = true
    }

    // Update canvas size when window resizing
    updateSize (width: number, height: number) {

        // Update camera        
        this.updateCamera()

        // Update renderer
        this.width = width
        this.height = height

        this.renderer.setSize(width, height)
        
    }
    
}