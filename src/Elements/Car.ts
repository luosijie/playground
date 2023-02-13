import { Group, Mesh, Box3 } from 'three'
// import Shadow from './Shadow'

import * as CANNON from 'cannon-es'
import { Body, Box, Cylinder, Quaternion, RaycastVehicle, Vec3 } from 'cannon-es'
import Physics from './Physics'

const options = {
    chassis: {
        width: 0, // 宽
        height: 0, // 高
        length: 0, // 长
        mass: 250
    },
    wheel: {
        radius: .27, // 半径
        width: .2, // 宽度
        height: 0, // 高度
        offsetWidth: 0.55, // 左右偏移量
        frontOffsetLength: 0.8, // 前轮偏移量
        backOffsetLength: 0.7, // 后轮偏移量
        suspensionStiffness: 55, // 悬挂刚度
        suspensionRestLength: 0.5, // 悬挂长度
        frictionSlip: 30, // 滑动摩擦系数
        dampingRelaxation: 2.3, // 悬挂复原阻尼
        dampingCompression: 4.3,
        maxSuspensionForce: 10000,
        rollInfluence:  0.01, // 施加侧向力时的位置系数, 越小越接近车身, 防止侧翻
        maxSuspensionTravel: 1,
        customSlidingRotationalSpeed: 30,
        useCustomSlidingRotationalSpeed: true,
        directionLocal: new CANNON.Vec3(0, 0, -1), // 车轮向下方向
        axleLocal: new CANNON.Vec3(1, 0, 0), // 车轴方向
        chassisConnectionPointLocal: new CANNON.Vec3(0, 0, 0), // 车轮连接点
    },
    control: {
        maxSteerVal: 0.5,
        maxForce: 750,
        brakeForce: 15
    }
}

export default class Car {
    model: Group
    physics: Physics

    options: any
    main: Group
    body: Group
    wheels: Group
    shadow: Mesh
    
    physicsBodys: any
    vehicle: RaycastVehicle

    controls: any
    constructor (physics: Physics) {

        this.physics = physics

        this.options = options

        this.main = new Group()
        
        // this.setWheels()
        // this.shadow = this.createShadow()
        // this.private setVehicle()

        // this.init()
    }

    build (model: Group) {
        this.model = model
        console.log('car-model', model)

        this.body = this.createBody()
        this.wheels = this.createWheels()

        this.main.add(this.body)
        this.main.add(this.wheels)

        this.vehicle = this.createVehicle()

        this.setControls()
    }
    
    private createBody () {
        const body = new Group()
        this.model.children.forEach((mesh: any) => {
            if (!mesh.name.includes('wheel')) {
                body.add(mesh.clone())
            }
        })

        // there has a wheel in the backside of the car
        const wheelBU = this.createWheel('left')
        wheelBU.name = 'wheelBU'
        wheelBU.position.x = 0.1
        wheelBU.position.z = -0.402342
        wheelBU.position.y = 0.742586
        wheelBU.rotation.z = Math.PI / 2
        body.add(wheelBU)
        
        // get body box size and center
        const box = new Box3().setFromObject(body)
        const size = {
            x: box.max.x - box.min.x,
            y: box.max.y - box.min.y,
            z: box.max.z - box.min.z,
        }
        const center = {
            x: (box.max.x + box.min.x) / 2,
            y: (box.max.y + box.min.y) / 2,
            z: (box.max.z + box.min.z) / 2,
        }

        // correct body center
        body.children.forEach(e => {
            e.position.x -= center.x
            e.position.y -= center.y
            e.position.z -= center.z
        })

        // update chassis config to correct size
        this.options.chassis.width = size.x / 2
        this.options.chassis.height = size.y / 2
        this.options.chassis.length = size.z / 2

        return body
    }
    
    // Five wheels to be set
    // Set material, position, rotation...
    private createWheels () {
        const wheels = new Group()

        const wheelL = this.createWheel('left')
        const wheelR = this.createWheel('right')

        // wheel-front-left
        const wheelFL = wheelL.clone()
        wheelFL.name = 'wheelFL'
        wheels.add(wheelFL)

        // wheel-front-right
        const wheelFR = wheelR.clone()
        wheelFR.name = 'wheelFR'
        wheels.add(wheelFR)

        // wheel-back-right
        const wheelBR = wheelR.clone()
        wheelBR.name = 'wheelBR'
        // wheelBR.position.set(-0.55, -0.5, -0.7)
        wheels.add(wheelBR)
        
        // wheel-back-left
        const wheelBL = wheelL.clone()
        wheelBL.name = 'wheelBL'
        wheels.add(wheelBL)

        return wheels
    }

    // Create different sides of wheel
    // Param direction has to be 'left' | 'right
    private createWheel (direction = 'left') {
        const wheel = new Group()
        this.model.children.forEach((modelMesh: any) => {
            if (!modelMesh.name.includes('wheel')) return
            const mesh = modelMesh.clone()
            mesh.position.set(0, 0, 0)

            if (direction === 'right') {
                mesh.rotateZ(Math.PI)
            }
            
            wheel.add(mesh)
            
        })
        return wheel
    }
    
    // private createShadow () {
    //     const shadow =  new Shadow(this.body)
    //     return shadow.main
    // }

    // Add models to sceen
    // build () {
    //     this.wheels.forEach(wheel => {
    //         this.main.add(wheel)
    //     })
    //     // this.main.add(this.shadow)
    // }

    private createVehicle () {
        // Init physicsBodys to store body and wheels
        this.physicsBodys = {}

        const chassisShape = new Box(
            new Vec3(this.options.chassis.width, this.options.chassis.height, this.options.chassis.length)
        )
        
        const chassisBody = new Body({ mass: this.options.chassis.mass })
        chassisBody.allowSleep = true
        // chassisBody.sleep()
        chassisBody.addShape(chassisShape)
        // position definded in blender
        chassisBody.position.set(26.7, -16.8, 1)
        // chassisBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 0)
        chassisBody.angularVelocity.set(0, 0, .5)

        this.physicsBodys['body'] = chassisBody

        // Vehicle
        const vehicle = new RaycastVehicle({
            chassisBody,
            indexRightAxis: 0,
            indexUpAxis: 2,
            indexForwardAxis: 1,
        })

        this.physicsBodys['wheels'] = []

        for (let i = 0; i < this.wheels.children.length; i++) {

            const option = { ...this.options.wheel }
            switch (i) {
                case 0:
                    // front left
                    option.chassisConnectionPointLocal.set(option.offsetWidth, -option.frontOffsetLength, 0)
                    break
                case 1:
                    // front right
                    option.chassisConnectionPointLocal.set(-option.offsetWidth, -option.frontOffsetLength, 0)
                    break
                case 2:
                    // back right
                    option.chassisConnectionPointLocal.set(-option.offsetWidth, option.backOffsetLength, 0)
                    break
                case 3:
                    // back left
                    option.chassisConnectionPointLocal.set(option.offsetWidth, option.backOffsetLength, 0)
                    break
            }
            vehicle.addWheel(option)

            const radius = option.radius
            const width = option.width
            const wheelShape = new Cylinder(radius, radius, width, 20)
            const wheelBody = new Body({ mass: 0, material: this.physics.materials.wheel })
            wheelBody.type = Body.KINEMATIC
            wheelBody.collisionFilterGroup = 0
            
            const wheelQuaternion = new Quaternion()
            wheelQuaternion.setFromAxisAngle(new Vec3(0, 0, 1), Math.PI / 2)   
            wheelBody.addShape(wheelShape, new Vec3(), wheelQuaternion)  

            this.physicsBodys['wheels'][i] = wheelBody
            this.physics.world.addBody(wheelBody)
        } 

        vehicle.addToWorld(this.physics.world)

        return vehicle
    }

    setControls () {
        if (this.controls) {
            window.removeEventListener('keydown', this.controls)
            window.removeEventListener('keyup', this.controls)
        }
        const maxSteerVal = this.options.control.maxSteerVal
        const maxForce = this.options.control.maxForce
        const brakeForce = this.options.control.brakeForce
        this.controls = (event: any) => {
            const up = (event.type == 'keyup')

            if (!up && event.type !== 'keydown') {
                return
            }

            this.vehicle.setBrake(0, 0)
            this.vehicle.setBrake(0, 1)
            this.vehicle.setBrake(0, 2)
            this.vehicle.setBrake(0, 3)

            switch (event.key) {
            
                case 'w':
                case 'ArrowUp': // forward
                    this.vehicle.applyEngineForce(up ? 0 : -maxForce, 2)
                    this.vehicle.applyEngineForce(up ? 0 : -maxForce, 3)
                    break

                case 's':
                case 'ArrowDown': // backward
                    this.vehicle.applyEngineForce(up ? 0 : maxForce, 2)
                    this.vehicle.applyEngineForce(up ? 0 : maxForce, 3)
                    break
            
                case 'a':
                case 'ArrowLeft': // left
                    // this.vehicle.applyEngineForce(up ? 0 : -maxForce, 0)
                    // this.vehicle.applyEngineForce(up ? 0 : -maxForce, 1)
                    this.vehicle.setSteeringValue(up ? 0 : maxSteerVal, 0)
                    this.vehicle.setSteeringValue(up ? 0 : maxSteerVal, 1)
                    break

                case 'd':
                case 'ArrowRight': // right
                    this.vehicle.setSteeringValue(up ? 0 : -maxSteerVal, 0)
                    this.vehicle.setSteeringValue(up ? 0 : -maxSteerVal, 1)
                    break
            
                case 'b':
                    this.vehicle.setBrake(brakeForce, 0)
                    this.vehicle.setBrake(brakeForce, 1)
                    this.vehicle.setBrake(brakeForce, 2)
                    this.vehicle.setBrake(brakeForce, 3)
                    break

            }
        }
        window.addEventListener('keydown', this.controls)
        window.addEventListener('keyup', this.controls)
        // document.onkeydown = this.controls
        // document.onkeyup = this.controls
    }

    update () {
        this.body.position.set(0, 0, 0)
        // Update body
        const physicsBody = this.physicsBodys['body']
        this.body.position.copy(physicsBody.position)
        this.body.quaternion.copy(physicsBody.quaternion)

        // Update wheels
        for  (let i = 0; i < this.vehicle.wheelInfos.length; i++) {
            this.vehicle.updateWheelTransform(i)
            const wheelInfo = this.vehicle.wheelInfos[i]
            const transform = wheelInfo.worldTransform
            const wheelBody = this.physicsBodys['wheels'][i]
            // update physics
            wheelBody.position.set(transform.position.x, transform.position.y, transform.position.z)
            wheelBody.quaternion.set(transform.quaternion.x, transform.quaternion.y, transform.quaternion.z, transform.quaternion.w)
            // update model
            this.wheels.children[i].position.copy(wheelBody.position)
            this.wheels.children[i].quaternion.copy(wheelBody.quaternion)
        }
    }

    destroy () {
        // Remove vehicle from physics world
        this.vehicle.removeFromWorld(this.physics.world)
        // this.physicsBodys['body'].removeFromWorld(this.app.physics.world)
        this.physicsBodys['wheels'].forEach((e: any) => {
            // console.log(e)
            this.physics.world.removeBody(e)
            // e.removeFromWorld(this.app.physics.world)
        })
    }

}
