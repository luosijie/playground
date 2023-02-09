import { Group, Mesh, Vector2 } from 'three'
import { gsap } from 'gsap'

export default class Ship {
    chairModels: Array<Mesh>
    bodyModels: Array<Mesh>
    main: Group

    rotation: number
    tl: GSAPTimeline
    constructor () {
        this.chairModels = []
        this.bodyModels = []
        this.main = new Group()

        this.rotation = -Math.PI / 2

        gsap.timeline({ repeat: -1, repeatDelay: 0})
            .to(this, { 'rotation': Math.PI / 2, duration: 1.2 })
            .to(this, { 'rotation': -Math.PI / 2, duration: 1.2 })
    }

    // Add relative mesh to models
    add (mesh: Mesh) {
        if (mesh.userData.name === 'ship-chair') {
            this.chairModels.push(mesh)
        } else {
            this.bodyModels.push(mesh)
        }
    }

    build () {
        const defaultPosition = this.bodyModels[0].position.clone()
        this.bodyModels.forEach(e => {
            e.position.set(0, 0, 0)
            this.main.add(e)
        })
        this.main.position.copy(defaultPosition)

        const defaultChairPosition = this.chairModels[0].position.clone()
        
        // duplicate chair
        const chair = new Group()
        this.chairModels.forEach(e => {
            e.position.set(0, 0, 0)
            chair.add(e)
        })
        const diffPosition = defaultChairPosition.sub(defaultPosition)
        chair.position.copy(diffPosition)
        this.main.add(chair)

        // 5 rows, 3 cols
        const mat = new Vector2(5, 3)
        const gap = new Vector2(.8, .7)
        for (let x = 0; x < mat.x; x++) {
            for (let y = 0; y < mat.y; y++) {
                if (x === 0 && y === 0) continue
                const n = chair.clone().translateX(gap.x * x).translateY(gap.y * y)
                this.main.add(n)
            }
        }
    }

    update () {
        this.main.rotation.y = this.rotation
    }
}