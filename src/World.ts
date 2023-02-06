import * as THREE from 'three'
import { Clock, PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { Size } from './Types'

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
        this.renderer = this.setRenderer()
        this.scene = new Scene()
        this.camera = this.setCamera()
        this.controls = new OrbitControls(this.camera, this.canvas)

        this.updateCamera()
    }

    render () {

        this.controls.update()
        this.renderer.render( this.scene, this.camera )
    }

    setCamera () {
        const camera = new PerspectiveCamera( 25, this.config.size.width / this.config.size.height, 0.01, 1000 )
        camera.position.z = 20
        camera.position.y = 20
        camera.position.x = 20
        return camera
    }

    updateCamera () {

        const angle = Math.atan( (this.config.size.height / 2) / 100 )
        const fov = angle * 180 / Math.PI * 2
        this.camera.fov = fov
        this.camera.aspect = this.config.size.width / this.config.size.height

        this.camera.updateProjectionMatrix()
    }

    setRenderer () {
        const renderer = new WebGLRenderer({ antialias: true, canvas: this.canvas, alpha: true })
        renderer.setSize( this.config.size.width, this.config.size.height)
        renderer.setAnimationLoop( this.render.bind(this) )
        return renderer
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

    setCube () {
        const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 )
        const material = new THREE.MeshNormalMaterial()

        const mesh = new THREE.Mesh( geometry, material )
        return mesh

    }
}