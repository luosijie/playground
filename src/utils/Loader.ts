
import { NearestFilter, sRGBEncoding, TextureLoader, VideoTexture } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

export enum LoaderType {
    Texture = 'Texture',
    GLTF = 'GLTF',
    FBX = 'FBX',
    Video = 'Video',
    PLY = 'PLY'
}

interface Resource {
    name: string, // used as key in resources
    type: LoaderType, // specify loaderType to load
    path: string  // file path
}

export default class Loader {
    resources: {[key: string]: any}
    total: number
    totalSuccess: number
    totalFail: number

    private fileLoaded: (name: string, res: any) => void
    private loadEnd: (resources: {[key: string]: any}) => void

    private gltfLoader: GLTFLoader
    private fbxLoader: FBXLoader
    private textureLoader: TextureLoader
    private plyLoader: PLYLoader
    
    constructor () {
        this.resources = {}
        this.total = 0
        this.totalSuccess = 0
        this.totalFail = 0

        // Functions to be registered
        this.fileLoaded = null!
        this.loadEnd = null!

        // GLTF loader
        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('draco/')
        const gltfLoader = new GLTFLoader()
        gltfLoader.setDRACOLoader(dracoLoader)
        this.gltfLoader = gltfLoader

        // FBX loader
        this.fbxLoader = new FBXLoader()
        
        // Texture loader
        this.textureLoader = new TextureLoader()

        // PLY loader
        this.plyLoader = new PLYLoader()

    }

    // Load files
    load (resources: Array<Resource>) {
        this.total += resources.length

        for (const resource of resources) {
            if (resource.type === LoaderType.Video) {
                this.loadVideo(resource)
            } else {
                this.loadResource(resource)
            }
        }
    }

    // Regist a fileLoaded function
    onFileLoaded (callback: (name: string, res: any) => any) {
        this.fileLoaded = callback
    }

    // Regist a loadEnd function
    onLoadEnd (callback: (resources: any) => void) {
        this.loadEnd = callback
    }

    private loadVideo (resource: Resource) {
        const name = resource.name
        const path = resource.path

        try {

            const video = document.createElement('video')
            video.src = path
            video.muted = true
            video.playsInline = true
            video.autoplay = true
            video.loop = true
            video.play()
    
            const videoTexture = new VideoTexture(video)
            videoTexture.magFilter = NearestFilter
            videoTexture.magFilter = NearestFilter
            videoTexture.generateMipmaps = false
            videoTexture.encoding = sRGBEncoding
    
            this.resources[name] = videoTexture

            this.loadSuccess(resource, videoTexture)
        } catch (err) {
            this.loadFail(resource, err)
        }
    }

    private loadResource (resource: Resource) { 
        const type = resource.type
        if (!type) {
            console.warn('type is required')
            return
        }

        let loader: GLTFLoader | FBXLoader | TextureLoader | PLYLoader = this.textureLoader

        switch (type) {
            case LoaderType.GLTF:
                loader = this.gltfLoader
                break
            case LoaderType.FBX:
                loader = this.fbxLoader
                break
            case LoaderType.Texture:
                loader = this.textureLoader
                break
            case LoaderType.PLY:
                loader = this.plyLoader
                break
            default:
                loader = this.textureLoader
        }

        loader.load(
            resource.path, 
            res => { this.loadSuccess(resource, res) },
            undefined,
            res => { this.loadFail(resource, res) }
        )     
    }

    // One file load successful
    private loadSuccess (resource: Resource, res: any) {
        this.totalSuccess++

        const name = resource.name
        this.resources[name] = res

        this.fileLoaded && this.fileLoaded(name, res)

        // trigger when file loadSuccess
        if (this.total === this.totalSuccess + this.totalFail) {
            this.loadEnd && this.loadEnd(this.resources)
        }
        
    }

    // One file load failed
    private loadFail (resource:Resource, res: any) {
        console.warn(`resource ${resource.name} load fail`, res)
        this.totalFail++

        // trigger when file loadFail
        if (this.total === this.totalSuccess + this.totalFail) {
            this.loadEnd(this.resources)
        }
    }
}
