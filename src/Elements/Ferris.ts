import { Group, Mesh, Vector3 } from 'three'

const RADIUS = 4
const SPEED = .01

export default class Ferris {
    chairModels: Array<Mesh>
    bodyModel: Mesh
    
    main: Group
    chairs: Array<Group>
    center: Vector3

    rotation: number
    constructor () {
        this.chairModels = []
        this.bodyModel = new Mesh()

        this.main = new Group()
        this.chairs = []    

        this.rotation = 0

    }

    // Add relative mesh to models
    add (mesh: Mesh) {
        if (mesh.userData.name === 'ferris-chair') {
            this.chairModels.push(mesh)
        } 
        if (mesh.userData.name === 'ferris-rotation') {
            this.bodyModel = mesh
        }
    }

    build () {
        this.center = this.bodyModel.position.clone()
        this.bodyModel.position.set(0, 0, 0)
        this.main.add(this.bodyModel)
        this.main.position.copy(this.center)
        
        // duplicate chair
        const chair = new Group()
        this.chairModels.forEach(e => {
            e.position.set(0, 0, 0)
            chair.add(e)
        })
        this.main.add(chair)

        const nums = 12
        this.chairs.push(chair) 
        for (let i = 1; i < nums; i++) {
            const n = chair.clone()
            n.position.set(0, 0, 0)
            this.main.add(n)
            this.chairs.push(n)
        }

        console.log(this.main.position)
    }

    private setChairsPosition () {
        for (let i = 0; i < this.chairs.length; i++) {
            const chair = this.chairs[i]
            const rand = Math.PI * 2 / this.chairs.length * i - this.rotation
            const x = RADIUS * Math.cos(rand)
            const z = RADIUS * Math.sin(rand)
            chair.position.x = x
            chair.position.z = z
        }
    }

    update () {
        this.rotation += SPEED
        this.bodyModel.rotation.y = this.rotation

        this.setChairsPosition()
    }
}