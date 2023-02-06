import { Mesh, PlaneGeometry } from 'three'
import backgroundMaterial from '@/materials/background'

export class Background {
    constructor () {

        const geometry = new PlaneGeometry(2, 2, 2)
        const material = backgroundMaterial()
        const mesh = new Mesh(geometry, material)

        return mesh
    }
}