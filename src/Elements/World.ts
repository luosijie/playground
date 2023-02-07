import { Clock, Color, MeshBasicMaterial, Object3D, PerspectiveCamera, Scene, sRGBEncoding, Vector3, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import Background from './Background'

import { Config } from '../Types'

import matcapMaterial from '@/materials/matcap'

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
        const renderer = new WebGLRenderer({ antialias: true, canvas: this.canvas, alpha: true })
        renderer.setSize( this.width, this.height)
        renderer.setAnimationLoop( this.render.bind(this) )
        renderer.outputEncoding = sRGBEncoding
        return renderer
    }

    private createCamera () {
        const camera = new PerspectiveCamera( 40, this.width / this.height, 0.01, 1000 )
        const multiple = 40
        
        camera.position.copy(new Vector3(1.135 * multiple,  1.45 * multiple, 1.15 * multiple))
        return camera
    }

    // Passed to renderer.setAnimationLoop
    private render () {
        // const elapsedTime = this.clock.getElapsedTime()
        // console.log('elapsedTime', elapsedTime)
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
        const colors = [ new Color('#cfbfa7'), new Color('#cfbfa7'), new Color('#cbbda5'), new Color('#ded5c8') ]
        const background = new Background(colors)
        this.scene.add(background.main)
    }

    // Build world elements with resources
    build (resources: any) {
        
        console.log('reources', resources)
        // handle backed elements
        const textureBaked = resources['texture-baked']
        textureBaked.flipY = false
        textureBaked.encoding = sRGBEncoding
        
        const bakedMaterial = new MeshBasicMaterial({ map: textureBaked })

        const modelPlayground = resources['model-playground'].scene
        const modelRailCar = resources['model-rail-car'].scene
        const modelCarScene = resources['model-car'].scene

        const models = [...modelPlayground.children, ...modelRailCar.children]
        models.forEach((e: any) => {
            if (e.type === 'Mesh') {
                // e.material = matcapMaterial(resources['matcap-brown'])
                e.material = bakedMaterial
                if (e.name.includes('matcap-') || e.name === 'rail') {
                    e.material = matcapMaterial(resources['matcap-brown'])
                } else {
                    e.matcapMaterial = bakedMaterial
                }
            }
        })
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
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        
    }
    
}