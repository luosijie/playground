import { Group, Mesh } from 'three'
import { gsap } from 'gsap'

export default class DropRotation {
    chairModels: Array<Mesh>
    bodyModel: Mesh
    main: Group

    rotation: number
    height: number
    constructor () {
        this.chairModels = []
        this.bodyModel = new Mesh()
        this.main = new Group()

        this.rotation = 0
        this.height = 2 // 1.5 - 8

        gsap.timeline({ repeat: -1, repeatDelay: 0})
            .to(this, { rotation: Math.PI * 2, height: 8.5, duration: 1.5 })
            .to(this, { rotation: 0,           height: 2, duration: 1.5 })
    }

    // Add relative mesh to models
    add (mesh: Mesh) {
        if (mesh.userData.name === 'drop-rotation-chair') {
            this.chairModels.push(mesh)
        } else {
            this.bodyModel = mesh
        }
    }

    build () {
        const defaultPosition = this.bodyModel.position.clone()
        this.bodyModel.position.set(0, 0, 0)
        this.main.add(this.bodyModel)
        this.main.position.copy(defaultPosition)
        
        // duplicate chair
        const chair = new Group()
        this.chairModels.forEach(e => {
            e.position.set(0, 0, 0)
            chair.add(e)
        })
        this.main.add(chair)

        const nums = 14
        const rand = Math.PI * 2 / nums
        for (let i = 1; i < nums; i++) {
            const n = chair.clone()
            n.rotation.set(0, 0, rand * i)
            this.main.add(n)
        }
    }

    update () {
        this.main.rotation.z = this.rotation
        this.main.position.z = this.height
    }
}