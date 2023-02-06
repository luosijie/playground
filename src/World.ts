import { Clock, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { Size } from '@/Types'

export interface Config {
    resources: any,
    canvas: HTMLCanvasElement,
    size: Size
}

export default class World {
    config: Config

    clock: Clock
    controls: OrbitControls

    canvas: HTMLCanvasElement
    renderer: WebGLRenderer
    scene: Scene
    camera: PerspectiveCamera

    constructor (config: Config) {
        this.config = config

        this.clock = new Clock()

        this.canvas = config.canvas
        this.renderer = this.createRenderer()
        this.scene = new Scene()
        this.camera = this.createCamera()
        this.controls = new OrbitControls(this.camera, this.canvas)

        this.updateCamera()
    }

    init () {
        this.setBackground()
    }

    createRenderer () {
        const renderer = new WebGLRenderer({ antialias: true, canvas: this.canvas, alpha: true })
        renderer.setSize( this.config.size.width, this.config.size.height)
        renderer.setAnimationLoop( this.render.bind(this) )
        return renderer
    }

    createCamera () {
        const camera = new PerspectiveCamera( 40, this.config.size.width / this.config.size.height, 0.01, 1000 )
        const multiple = 23
        
        camera.position.copy(new Vector3(1.135 * multiple,  1.45 * multiple, 1.15 * multiple))
        return camera
    }

    render () {

        this.controls.update()
        this.renderer.render( this.scene, this.camera )
    }

    updateCamera () {

        this.camera.aspect = this.config.size.width / this.config.size.height

        this.camera.updateProjectionMatrix()
    }

    updateSize (width: number, height: number) {

        // Update camera        
        this.updateCamera()

        // Update renderer
        this.config.size.width = width
        this.config.size.height = height

        this.renderer.setSize(width, height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        
    }

    setBackground () {
        //
    }
}