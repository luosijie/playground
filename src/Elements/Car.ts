import { Group, Box3, Vector3, Vector2 } from 'three'
// import Shadow from './Shadow'

import { Body, Box, Cylinder, Quaternion, RaycastVehicle, Vec3 } from 'cannon-es'
import Physics from './Physics'
import CustomShadow from './CustomShadow'
import Sound from './Sound'
import checkMobile from '@/utils/checkMobile'
import JoyStick, { StickStatus } from '@/libs/JoyStick'

const options = {
    chassis: {
        width: 0,
        height: 0,
        length: 0,
        mass: 250
    },
    wheel: {
        radius: .27,
        width: .2,
        height: 0,
        offsetWidth: 0.55,
        frontOffsetLength: 0.8,
        backOffsetLength: 0.7,
        suspensionStiffness: 55, 
        suspensionRestLength: 0.5, 
        frictionSlip: 30,
        dampingRelaxation: 2.3,
        dampingCompression: 4.3,
        maxSuspensionForce: 10000,
        rollInfluence:  0.01,
        maxSuspensionTravel: 1,
        customSlidingRotationalSpeed: 30,
        useCustomSlidingRotationalSpeed: true,
        directionLocal: new Vec3(0, 0, -1),
        axleLocal: new Vec3(1, 0, 0),
        chassisConnectionPointLocal: new Vec3(0, 0, 0)
    },
    control: {
        maxSteerVal: 0.5,
        maxForce: 380,
        brakeForce: 20
    }
}

enum SoundName {
    Engine = 'Engine',
    Brake = 'Brake'
}

export default class Car {
    model: Group
    physics: Physics
    sounds: { [key in SoundName]: Sound }

    options: any
    main: Group
    body: Group
    wheels: Group
    shadow: CustomShadow
    
    physicsBodies: any
    vehicle: RaycastVehicle
    speed: number

    controls: any
    constructor (physics: Physics) {

        this.physics = physics
        this.sounds = this.createSounds()

        this.options = options

        this.main = new Group()

        this.physicsBodies = {
            chassis: null,
            wheels: []
        }

        this.speed = 0

        this.shadow = new CustomShadow()
        
    }

    build (model: Group) {
        this.sounds[SoundName.Engine].play()
        
        this.model = model

        this.body = this.createBody()
        this.wheels = this.createWheels()
        this.shadow.build(this.body)

        this.main.add(this.body)
        this.main.add(this.wheels)
        this.main.add(this.shadow.main)

        this.shadow.build(this.body)

        this.vehicle = this.createVehicle()
    }
    
    private createSounds () {
        return {
            [SoundName.Engine]: new Sound({ src: ['sounds/car-engine.wav'], loop: true }),
            [SoundName.Brake]: new Sound({ src: ['sounds/car-brake.mp3'] })
        }
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
        this.options.chassis.length = size.y / 2
        this.options.chassis.height = size.z / 2

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
        
        // wheel-back-left
        const wheelBL = wheelL.clone()
        wheelBL.name = 'wheelBL'
        wheels.add(wheelBL)

        // wheel-back-right
        const wheelBR = wheelR.clone()
        wheelBR.name = 'wheelBR'
        // wheelBR.position.set(-0.55, -0.5, -0.7)
        wheels.add(wheelBR)

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
    
    private createVehicle () {

        const chassisShape = new Box(
            new Vec3(this.options.chassis.width, this.options.chassis.length, this.options.chassis.height)
        )
        
        const chassisBody = new Body({ mass: this.options.chassis.mass })
        chassisBody.allowSleep = true
        // chassisBody.sleep()
        chassisBody.addShape(chassisShape)
        // position definded in blender
        chassisBody.position.set(26.7, -16.8, 10)
        // chassisBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), 0)
        chassisBody.angularVelocity.set(0, 0, .5)

        this.physicsBodies.chassis = chassisBody

        // Vehicle
        const vehicle = new RaycastVehicle({
            chassisBody,
            indexRightAxis: 0,
            indexUpAxis: 2,
            indexForwardAxis: 1,
        })

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
                    // back left
                    option.chassisConnectionPointLocal.set(option.offsetWidth, option.backOffsetLength, 0)
                    break
                case 3:
                    // back right
                    option.chassisConnectionPointLocal.set(-option.offsetWidth, option.backOffsetLength, 0)
                    break
            }
            vehicle.addWheel(option)

            const radius = option.radius
            const width = option.width
            const wheelShape = new Cylinder(radius, radius, width, 30)
            const wheelBody = new Body({ mass: 20, material: this.physics.materials.wheel })
            
            const wheelQuaternion = new Quaternion()
            wheelQuaternion.setFromAxisAngle(new Vec3(0, 0, 1), Math.PI / 2)   
            wheelBody.addShape(wheelShape, new Vec3(), wheelQuaternion) 
             
            wheelBody.type = Body.KINEMATIC
            wheelBody.collisionFilterGroup = 0

            this.physicsBodies.wheels[i] = wheelBody
            this.physics.world.addBody(wheelBody)
        } 

        vehicle.addToWorld(this.physics.world)

        return vehicle
    }

    setControls () {
        
        const maxSteerVal = this.options.control.maxSteerVal
        const maxForce = this.options.control.maxForce
        const brakeForce = this.options.control.brakeForce

        // for mobile
        if (checkMobile()) {
            const stickContainer = document.createElement('div')
            stickContainer.style.cssText = `
                position: fixed;
                width: 80px;
                height: 80px;
                z-index: 99999999;
                border-radius: 50%;
                bottom: 30px;
                left: 50%;
                margin-left: -40px;
            `
            document.body.appendChild(stickContainer)

            new JoyStick(stickContainer, {  }, (status: StickStatus) => {
                const position = new Vector2(status.x, status.y)
                let force = position.length()
                force = force > maxForce ? maxForce : force

                force = position.y > 0 ? -force : force

                this.vehicle.applyEngineForce(force, 2)
                this.vehicle.applyEngineForce(force, 3)

                const angle = position.angle()
                let steerVal = position.y > 0 ? Math.abs(Math.PI / 2 - angle) : Math.abs(Math.PI / 2 * 3 - angle)
                steerVal = steerVal > maxSteerVal ? maxSteerVal : steerVal
                steerVal = position.x > 0 ? -steerVal : steerVal
                this.vehicle.setSteeringValue(steerVal, 0)
                this.vehicle.setSteeringValue(steerVal, 1)
            })
            return
        }

        // for desktop

        if (this.controls) {
            window.removeEventListener('keydown', this.controls)
            window.removeEventListener('keyup', this.controls)
        }

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
                    this.sounds[SoundName.Brake].play()
                    break

            }
        }
        window.addEventListener('keydown', this.controls)
        window.addEventListener('keyup', this.controls)
    }

    update () {
        // this.body.position.set(0, 0, 0)
        // Update body
        const physicsChassis = this.physicsBodies.chassis

        this.speed = this.body.position.distanceTo(new Vector3(physicsChassis.position.x, physicsChassis.position.y, physicsChassis.position.z))
        this.sounds.Engine.volume(this.speed)
        
        this.body.position.copy(physicsChassis.position)
        this.body.quaternion.copy(physicsChassis.quaternion)

        // const localZ = new Vector3(0, 0, 1).applyQuaternion(this.body.quaternion)
        // const angle = localZ.angleTo(new Vector3(0, 0, 1))
        // console.log(angle / Math.PI * 180)

        // Update wheels
        for  (let i = 0; i < this.vehicle.wheelInfos.length; i++) {
            this.vehicle.updateWheelTransform(i)
            const wheelInfo = this.vehicle.wheelInfos[i]
            const transform = wheelInfo.worldTransform
            const wheelBody = this.physicsBodies.wheels[i]
            // update physics
            wheelBody.position.set(transform.position.x, transform.position.y, transform.position.z)
            wheelBody.quaternion.set(transform.quaternion.x, transform.quaternion.y, transform.quaternion.z, transform.quaternion.w)
            // update model
            this.wheels.children[i].position.copy(wheelBody.position)
            this.wheels.children[i].quaternion.copy(wheelBody.quaternion)
        }

        this.shadow.update()
    }

    destroy () {
        // Remove vehicle from physics world
        this.vehicle.removeFromWorld(this.physics.world)
        // this.physicsBodies['body'].removeFromWorld(this.app.physics.world)
        this.physicsBodies.wheels.forEach((e: any) => {
            // console.log(e)
            this.physics.world.removeBody(e)
            // e.removeFromWorld(this.app.physics.world)
        })
    }

}
