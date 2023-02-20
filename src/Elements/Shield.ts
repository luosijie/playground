import { Mesh, Vector3, Shape, ExtrudeGeometry, ShaderMaterial } from 'three'
import Physics, { CollideSoundName } from './Physics'
import { Body, SHAPE_TYPES } from 'cannon-es'
import { gsap } from 'gsap'

import createShielMaterial from '@/materials/createShieldMaterial'
import debounce from '@/utils/debounce'

export default class Shield {
    physics: Physics
    physicsBody: Body
    
    material: ShaderMaterial
    main: Mesh

    constructor (physics: Physics, modelMesh: Mesh) {
        this.physics = physics

        this.material = createShielMaterial()
        this.main = this.createMesh(modelMesh)
        this.physicsBody = this.createPhysicsBody()

    }

    private createMesh (modelMesh: Mesh) {

        const shape = new Shape()
        const position = modelMesh.geometry.attributes.position
        const points = []
        for (let i = 0; i < position.count; i++) {
            const point = new Vector3(
                position.array[i * 3 + 0],
                position.array[i * 3 + 1],
                position.array[i * 3 + 2],
            )
            if (!points.length) {
                shape.moveTo(point.x, point.y)
            } else {
                shape.lineTo(point.x, point.y)
            }
            points.push(point)
        }
        const firstPoint = points[0]
        shape.lineTo(firstPoint.x, firstPoint.y)

        const geometry = new ExtrudeGeometry(shape, { depth: 3, bevelEnabled: false })
        // const material = createShielMaterial()
        const mesh = new Mesh(geometry, this.material)
        
        mesh.position.copy(modelMesh.position)

        return mesh

    }

    private createPhysicsBody () {
        const physicsBody = this.physics.createBody({ mesh: this.main, shapeType: SHAPE_TYPES.BOX, mass: 0, collideSound: CollideSoundName.Wall })
      
        physicsBody.addEventListener('collide', () => {
            this.show()
        })

        return physicsBody
    }

    // Show shield effect
    private show = debounce(() => {
        gsap.timeline()
            .to(this.material.uniforms.uHeight, { value: 3.0, duration: .5 })
            .to(this.material.uniforms.uHeight, { value: .0, duration: 2 })
        
    }, 3000)
}