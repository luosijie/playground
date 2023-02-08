
import { Group, Mesh, Scene, Vector2, Vector3, Vector4 } from 'three'

export interface RepeatedModels {
    mole: Group,
    teaShopFan: Group,
    carStationFan: Group,
    coffeeCarWheel: Group,
    dropUpCylinder: Mesh
    coffeChair: Mesh
    coffeTable: Mesh
    sheep: Group,
    chicken: Group,
    rabbit: Group,
}

const degToRand = (deg: number) => {
    return deg / 180 * Math.PI
}

/**
 * Repetitive and boring work
 * Handle some models that is repeated but only exported one instance in blender
 * Just to minimize the size of exported file, maybe decrease 500KB
 * @param models get repeated modles 
 * @param scene add to scene after after handling
 */
export default function (models: RepeatedModels, scene: Scene) {

    // mole
    const mole = models.mole
    const modelGap = 2
    const modelMat = [2, 2]
    for (let x = 0; x < modelMat[0]; x++) {
        for (let y = 0; y < modelMat[1]; y++) {
            if (x == 0 && y === 0) continue
            const n = mole.clone().translateX(-x * modelGap).translateY(y * modelGap)
            scene.add(n)
        }
    }

    // tea-shop-fan
    const teaShopFan = models.teaShopFan
    const teaShopFanGap = 1.8
    const teaShopFanMat = [2, 2]
    for (let x = 0; x < teaShopFanMat[0]; x++) {
        for (let y = 0; y < teaShopFanMat[1]; y++) {
            if (x == 0 && y === 0) continue
            const n = teaShopFan.clone().translateX(x * teaShopFanGap).translateY(y * teaShopFanGap)
            scene.add(n)
        }
    }

    // tea-shop-fan
    const carStationFan = models.carStationFan
    const carStationFanGap = 2.2
    const carStationFanNum = 4
    for (let x = 1; x < carStationFanNum; x++) {
        const n = carStationFan.clone().translateX(x * carStationFanGap)
        scene.add(n)
    }

    // coffee-car-wheel
    const coffeeCarWheel = models.coffeeCarWheel
    const coffeeCarWheelMat = [
        new Vector4(0, Math.PI),
        new Vector4(Math.PI, 0),
        new Vector4(Math.PI, Math.PI),
    ]
    for (let i = 0; i < coffeeCarWheelMat.length; i++) {
        const rotation = coffeeCarWheelMat[i]
        const n = coffeeCarWheel.clone().rotateX(rotation.x).rotateY(rotation.y)
        n.position.set(-9.36434, 13.2031, 0.749157)
        scene.add(n)
    }

    // drop-up-cylinder
    const dropUpCylinder = models.dropUpCylinder
    const dropUpCylinderGap = 1
    const dropUpCylinderNum = 6
    for (let y = 1; y < dropUpCylinderNum; y++) {
        const n = dropUpCylinder.clone().translateY(y * dropUpCylinderGap)
        scene.add(n)
    }

    // coffe-chair
    const coffeChair = models.coffeChair
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
        const n = coffeChair.clone().rotateZ(mat.w)
        n.position.set(mat.x, mat.y, mat.z)
        scene.add(n)
    }

    // coffe-chair
    const coffeTable = models.coffeTable
    const coffeeTableMat = [
        new Vector3(-5.82097, 11.0665, 0.524698),
        new Vector3(-3.39666, 11.0665, 0.524698),

        new Vector3(-5.82097, 15.5753, 0.524698),
        new Vector3(-3.39666, 15.5753, 0.524698)
    ]

    for (let i = 1; i < coffeeTableMat.length; i++) {
        const mat = coffeeTableMat[i]
        const n = coffeTable.clone()
        n.position.copy(mat)
        scene.add(n)
    }

    // sheep
    const sheep = models.sheep
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
        scene.add(n)
    }

    // sheep
    const chicken = models.chicken
    const chickenMat = [
        new Vector4(15.0235, 11.1775, 0.505387, degToRand(61.509)),
        new Vector4(11.1837, 11.0559, 0.505387, degToRand(1.47331)),
        new Vector4(16.0103, 12.9867, 0.505387, degToRand(25.7134)),
        new Vector4(13.3788, 15.3714, 0.505387, degToRand(6.69899)),
        new Vector4(11.2202, 16.2143, 0.505387, degToRand(-26.7294)),
        new Vector4(16.3804, 16.6666, 0.505387, degToRand(74.7854))
    ]

    for (let i = 1; i < chickenMat.length; i++) {
        const mat = chickenMat[i]
        const n = chicken.clone().rotateZ(mat.w)
        n.position.copy(new Vector3(mat.x, mat.y, mat.z))
        scene.add(n)
    }

    // rabbit
    const rabbit = models.rabbit
    const rabbitMat = [
        new Vector4(12.5582, 12.5105, 0.949029, degToRand(-7.29225)),
        new Vector4(14.517, 12.9141, 0.949029, degToRand(20.2972)),
        new Vector4(15.8362, 14.9528, 0.949029, degToRand(105.298))
    ]

    for (let i = 1; i < rabbitMat.length; i++) {
        const mat = rabbitMat[i]
        const n = rabbit.clone().rotateZ(mat.w)
        n.position.copy(new Vector3(mat.x, mat.y, mat.z))
        scene.add(n)
    }
}