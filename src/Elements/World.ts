import { Clock, Color, Group, Mesh, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import Background from './Background'

import { Config } from '../Types'

import matcapMaterial from '@/materials/matcap'

import handleRepeats, { RepeatedModels } from '@/functions/handleRepeats'

import RailCar from './RailCar'
import Car from './Car'
import Physics from './Physics'

export default class World {

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
    railCar: RailCar
    car: Car

    constructor (config: Config) {
        this.width = config.width
        this.height = config.height

        this.clock = new Clock()

        this.canvas = config.canvas
        this.renderer = this.createRenderer()
        this.scene = new Scene()
        this.camera = this.createCamera()
        this.controls = new OrbitControls(this.camera, this.canvas)
        
        this.physics = new Physics()
        this.car = new Car(this.physics)
        
        this.init()
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
        
        this.car.isReady && this.car.update()

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
        
        console.log('reources', resources)

        const modelPlayground = resources['model-playground'].scene
        const modelCarScene = resources['model-car'].scene
        const modelRailCar : Array<Mesh> = []

        const repeatModels : RepeatedModels = {
            mole: new Group(),
            teaShopFan: new Group(),
            carStationFan: new Group(),
            coffeeCarWheel: new Group(),
            dropUpCylinder: new Mesh(),
            coffeChair: new Mesh(),
            coffeTable: new Mesh(),
            sheep: new Group(),
            chicken: new Group(),
            rabbit: new Group()
        }

        const models = modelPlayground.children

        models.forEach((e: any) => {
            const data = e.userData

            // set matcap color
            if (data.matcap) {
                e.material = matcapMaterial(resources[`matcap-${data.matcap}`])
            }

            if (data.name === 'mole') {
                repeatModels.mole.add(e.clone())
            }
            if (data.name === 'tea-shop-fan') {
                repeatModels.teaShopFan.add(e.clone())
            }
            if (data.name === 'car-station-fan') {
                repeatModels.carStationFan.add(e.clone())
            }
            if (data.name === 'coffee-car-wheel') {
                const n = e.clone()
                n.position.copy(new Vector3())
                repeatModels.coffeeCarWheel.add(n)
            }
            if (data.name === 'coffee-chair') {
                repeatModels.coffeChair = e
            }
            if (data.name === 'coffee-table') {
                repeatModels.coffeTable = e
            }
            if (data.name === 'sheep') {
                const n = e.clone()
                n.position.copy(new Vector3())
                repeatModels.sheep.add(n)
            }
            if (data.name === 'chicken') {
                const n = e.clone()
                n.position.copy(new Vector3())
                repeatModels.chicken.add(n)
            }
            if (data.name === 'rabbit') {
                const n = e.clone()
                n.position.copy(new Vector3())
                repeatModels.rabbit.add(n)
            }
            if (data.name === 'drop-up-cylinder') {
                repeatModels.dropUpCylinder = e
            }

            // modles to animate
            if (data.name === 'rail-car') {
                modelRailCar.push(e)
                // modelPlayground.remove(e)
            }
        })

        handleRepeats(repeatModels, this.scene)

        this.scene.add(modelPlayground)

        // init rail car
        this.railCar = new RailCar(modelRailCar)
        this.scene.add(this.railCar.main)

        // init car
        this.car.build(modelCarScene)
        this.scene.add(this.car.main)
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