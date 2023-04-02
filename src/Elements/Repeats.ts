/**
 * Repetitive and boring work
 * Handle some models that is repeated but only exported one instance in blender
 * Just to minimize the size of exported file, maybe decrease 500KB
 */

import { SHAPE_TYPES } from 'cannon-es'
import { Group, Mesh, Vector3, Vector4 } from 'three'
import Physics, { CollideSoundName } from './Physics'

const degToRand = (deg: number) => {
    return deg / 180 * Math.PI
}

export default class Repeats {
    physics: Physics

    main: Group
    models: any
    constructor (physics: Physics) {
        this.physics = physics

        this.main = new Group()
        this.models = {
            'mole': new Group(),
            'tea-shop-fan': new Group(),
            'car-station-fan': new Group(),
            'carousel-ball': new Mesh(),
            'coffee-car-wheel': new Group(),
            'drop-up-cylinder': new Mesh(),
            'coffee-chair': new Mesh(),
            'coffee-table': new Mesh(),
            'station-sylinder': new Mesh(),
            'sheep': new Group(),
            'chicken': new Group(),
            'rabbit': new Group()
        }
    }

    contains (name: string) {
        return Object.keys(this.models).includes(name)
    }
    
    add (name: string, model: Mesh) {
        const m = model.clone()
        if (this.models[name] instanceof Group) {
            m.position.copy(new Vector3())
            this.models[name].add(m)
        } else {
            this.models[name] = m
        }
    }

    build () {

        // mole
        const mole = this.models['mole']
        const modelGap = 2
        const modelMat = [2, 2]
        mole.position.set(14.7923, -14.8635, 1.96653)
        for (let x = 0; x < modelMat[0]; x++) {
            for (let y = 0; y < modelMat[1]; y++) {
                if (x == 0 && y === 0) continue
                const n = mole.clone().translateX(-x * modelGap).translateY(y * modelGap)
                this.main.add(n)
            }
        }

        // tea-shop-fan
        const teaShopFan = this.models['tea-shop-fan']
        const teaShopFanGap = 1.8
        const teaShopFanMat = [2, 2]
        teaShopFan.position.set(-6.01082, -10.8145, 2.09206)
        for (let x = 0; x < teaShopFanMat[0]; x++) {
            for (let y = 0; y < teaShopFanMat[1]; y++) {
                if (x == 0 && y === 0) continue
                const n = teaShopFan.clone().translateX(x * teaShopFanGap).translateY(y * teaShopFanGap)
                this.main.add(n)
            }
        }

        // car-station-fan
        const carStationFan = this.models['car-station-fan']
        const carStationFanGap = 2.2
        const carStationFanNum = 4
        carStationFan.position.copy(new Vector3(-11.5902, 20.8363, 6.09009))
        for (let x = 0; x < carStationFanNum; x++) {
            const n = carStationFan.clone().translateX(x * carStationFanGap)
            this.main.add(n)
        }

        // car-station-sylinder
        const statiopnSylinder = this.models['station-sylinder']
        
        this.physics.createBody({ mesh: statiopnSylinder, shapeType: SHAPE_TYPES.CYLINDER, mass: 0, collideSound: CollideSoundName.Wall })
        const statiopnSylinderGap = 4.0
        const statiopnSylinderNum = 3
        for (let x = 1; x < statiopnSylinderNum; x++) {
            const n = statiopnSylinder.clone().translateX(x * statiopnSylinderGap)
            this.physics.createBody({ mesh: n, shapeType: SHAPE_TYPES.CYLINDER, mass: 0, collideSound: CollideSoundName.Wall })
            this.main.add(n)
        }
        // console.log('statiopnSylinder', statiopnSylinder)
        // statiopnSylinder.parent.remove(statiopnSylinder)

        // carousel-ball
        const carouselBall = this.models['carousel-ball']
        for (let z = 1; z < 12; z++ ) {
            const n = carouselBall.clone()
            n.rotateZ(Math.PI * 2 / 12 * z)
            this.main.add(n)
        }

        for (let z = 0; z < 12; z++ ) {
            const n = carouselBall.clone().rotateZ(Math.PI * 2 / 12 * z).translateZ(3.4)
            n.scale.set(.95, .95, .95)
            this.main.add(n)
        }

        // coffee-car-wheel
        const coffeeCarWheel = this.models['coffee-car-wheel']
        const coffeeCarWheelMat = [
            new Vector4(0, Math.PI),
            new Vector4(Math.PI, 0),
            new Vector4(Math.PI, Math.PI),
        ]
        for (let i = 0; i < coffeeCarWheelMat.length; i++) {
            const rotation = coffeeCarWheelMat[i]
            const n = coffeeCarWheel.clone().rotateX(rotation.x).rotateY(rotation.y)
            n.position.set(-9.36434, 13.2031, 0.749157)
            this.main.add(n)
        }

        // drop-up-cylinder
        const dropUpCylinder = this.models['drop-up-cylinder']
        const dropUpCylinderGap = 1
        const dropUpCylinderNum = 6
        for (let y = 1; y < dropUpCylinderNum; y++) {
            const n = dropUpCylinder.clone().translateY(y * dropUpCylinderGap)
            this.main.add(n)
        }

        // coffe-chair
        const coffee = this.models['coffee-chair']
        const coffeeChairMat = [
            new Vector4(-5.86628, 9.35516, 0.175147, 0),
            new Vector4(-3.44198, 9.35516, 0.175147, 0),

            new Vector4(-5.86628, 12.6858, 0.175147, Math.PI),
            new Vector4(-3.44198, 12.6858, 0.175147, Math.PI),

            new Vector4(-5.86628, 13.8639, 0.175147, 0),
            new Vector4(-3.44198, 13.8639, 0.175147, 0),

            new Vector4(-5.86628, 17.1945, 0.175147, Math.PI),
            new Vector4(-3.44198, 17.1945, 0.175147, Math.PI)
        ]

        for (let i = 1; i < coffeeChairMat.length; i++) {
            const mat = coffeeChairMat[i]
            const n = coffee.clone().rotateZ(mat.w)
            n.position.set(mat.x, mat.y, mat.z)
            this.main.add(n)
        }

        // coffe-chair
        const coffeeTable = this.models['coffee-table']
        const coffeeTableMat = [
            new Vector3(-5.82097, 11.0665, 0.524698),
            new Vector3(-3.39666, 11.0665, 0.524698),

            new Vector3(-5.82097, 15.5753, 0.524698),
            new Vector3(-3.39666, 15.5753, 0.524698)
        ]

        for (let i = 1; i < coffeeTableMat.length; i++) {
            const mat = coffeeTableMat[i]
            const n = coffeeTable.clone()
            n.position.copy(mat)
            this.main.add(n)
        }

        // sheep
        const sheep = this.models['sheep']
        const sheepMat = [
            new Vector4(13.8021, 4.19636, 1.62158, degToRand(-183.461)),
            new Vector4(11.4091, 5.0598, 1.62158, degToRand(-290.162)),
            new Vector4(15.2576, 5.87391, 1.62158, degToRand(-227.591)),
            new Vector4(13.7774, 7.67482, 1.62158, degToRand(-349.738)),
            new Vector4(16.1211, 8.39025, 1.62158, degToRand(-225.018)),
            new Vector4(11.6065, 8.66162, 1.62158, degToRand(-349.738))
        ]

        for (let i = 1; i < sheepMat.length; i++) {
            const mat = sheepMat[i]
            const n = sheep.clone().rotateZ(mat.w)
            n.position.copy(new Vector3(mat.x, mat.y, mat.z))
            this.main.add(n)
        }

        // chicken
        const chicken = this.models['chicken']
        const chickenMat = [
            new Vector4(15.0235, 11.1775, 0.505387, degToRand(61.509)),
            new Vector4(11.1837, 11.0559, 0.505387, degToRand(1.47331)),
            new Vector4(16.0103, 12.9867, 0.505387, degToRand(25.7134)),
            new Vector4(13.3788, 15.3714, 0.505387, degToRand(6.69899)),
            new Vector4(11.2202, 16.2143, 0.505387, degToRand(-26.7294)),
            new Vector4(11.3025, 14.1174, 0.505387, degToRand(99.1655)),
            new Vector4(16.3804, 16.6666, 0.505387, degToRand(74.7854))
        ]

        for (let i = 1; i < chickenMat.length; i++) {
            const mat = chickenMat[i]
            const n = chicken.clone().rotateZ(mat.w)
            n.position.copy(new Vector3(mat.x, mat.y, mat.z))
            this.main.add(n)
        }

        // rabbit
        const rabbit = this.models['rabbit']
        const rabbitMat = [
            new Vector4(12.5582, 12.5105, 0.949029, degToRand(-7.29225)),
            new Vector4(14.517, 12.9141, 0.949029, degToRand(20.2972)),
            new Vector4(15.8362, 14.9528, 0.949029, degToRand(105.298))
        ]

        for (let i = 1; i < rabbitMat.length; i++) {
            const mat = rabbitMat[i]
            const n = rabbit.clone().rotateZ(mat.w)
            n.position.copy(new Vector3(mat.x, mat.y, mat.z))
            this.main.add(n)
        }
        
    }
}