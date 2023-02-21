/*
 *  Original from (https://github.com/bobboteck/JoyStick).
 *	Copyright (c) 2015 Roberto D'Amico (Bobboteck).
 *  Converted to ts version By Jesse Luo
 */

export interface StickStatus {
    xPosition: number,
    yPosition: number,
    x: number,
    y: number,
    cardinalDirection: string
}

export default class JoyStick {
    parameters: any
    callback: (status: StickStatus) => void

    canvas: HTMLCanvasElement
    context: any

    pressed: number
    circumference: number
    internalRadius: number
    maxMoveStick: number
    externalRadius: number
    centerX: number
    centerY: number
    directionHorizontalLimitPos: number
    directionHorizontalLimitNeg: number
    directionVerticalLimitPos: number
    directionVerticalLimitNeg: number
    movedX: number
    movedY: number
    constructor (container: HTMLElement, parameters: any, callback: (status: StickStatus) => void) {

        this.parameters = {
            title: 'joystick',
            width: 0,
            height: 0,
            internalFillColor: '#ffffff80',
            internalLineWidth: 2,
            internalStrokeColor: '#ffffff',
            externalLineWidth: 1,
            externalStrokeColor: '#ffffff30',
            autoReturnToCenter: true
        }

        for (const key in parameters) {
            if (parameters[key] !== 'undefined') {
                this.parameters[key] = parameters[key]
            }
        }

        this.callback = callback
        
        this.canvas = this.createCanvas(container)
        this.context = this.canvas.getContext('2d')

        this.pressed = 0 // Bool - 1=Yes - 0=No
        this.circumference = 2 * Math.PI
        this.internalRadius = (this.canvas.width - ((this.canvas.width / 2) + 10)) / 2
        this.maxMoveStick = this.internalRadius + 2
        this.externalRadius = this.internalRadius + 10
        this.centerX = this.canvas.width / 2
        this.centerY = this.canvas.height / 2
        this.directionHorizontalLimitPos = this.canvas.width / 10
        this.directionHorizontalLimitNeg = this.directionHorizontalLimitPos * -1
        this.directionVerticalLimitPos = this.canvas.height / 10
        this.directionVerticalLimitNeg = this.directionVerticalLimitPos * -1
        // Used to save current position of stick
        this.movedX = this.centerX
        this.movedY = this.centerY
        
        // Check if the device support the touch or not
        if ('ontouchstart' in document.documentElement) {
            this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this), false)
            this.canvas.addEventListener('touchmove', this.onTouchMove.bind(this), false)
            this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this), false)
        } else {
            this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this), false)
            document.addEventListener('mousemove', this.onMouseMove.bind(this), false)
            document.addEventListener('mouseup', this.onMouseUp.bind(this), false)
        }

        // Draw the object
        this.drawExternal()
        this.drawInternal()
        
    }

    private createCanvas (container: HTMLElement) {
        container.style.touchAction = 'none'

        const canvas = document.createElement('canvas')
        canvas.id = this.parameters.title
        canvas.width = this.parameters.width || container.clientWidth
        canvas.height = this.parameters.height || container.clientHeight

        container.appendChild(canvas)
        return canvas
    }

    private drawExternal () {
        this.context.beginPath()
        
        this.context.arc(this.centerX, this.centerY, this.externalRadius, 0, this.circumference, false)
        this.context.lineWidth = this.externalRadius
        this.context.strokeStyle = this.parameters.externalStrokeColor
        this.context.stroke()
    }

    private drawInternal () {
        this.context.beginPath()

        if (this.movedX < this.internalRadius) this.movedX = this.maxMoveStick
        if ((this.movedX + this.internalRadius) > this.canvas.width) this.movedX = this.canvas.width - this.maxMoveStick
        if (this.movedY < this.internalRadius) this.movedY = this.maxMoveStick
        if ((this.movedY + this.internalRadius) > this.canvas.height ) this.movedY = this.canvas.height - this.maxMoveStick

        this.context.arc(this.movedX, this.movedY, this.internalRadius, 0, this.circumference, false)

        // Create radial gradient
        const grd = this.context.createRadialGradient(this.centerX, this.centerY, 5, this.centerX, this.centerY, 200)
        // Light color
        grd.addColorStop(0, this.parameters.internalFillColor)
        // Dark color
        grd.addColorStop(1, this.parameters.internalStrokeColor)

        this.context.fillStyle = grd
        this.context.fill()
        this.context.lineWidth = this.parameters.internalLineWidth
        this.context.strokeStyle = this.parameters.internalStrokeColor
        this.context.stroke()
    }

    private onTouchStart () {
        this.pressed = 1
    }

    private onTouchMove (evt: TouchEvent) {
        if (this.pressed === 1 && evt.targetTouches[0].target === this.canvas) {
            this.movedX = evt.targetTouches[0].pageX
            this.movedY = evt.targetTouches[0].pageY

            // Manage offset
            const offsetParent = this.canvas.offsetParent
            if (offsetParent instanceof HTMLDivElement) {
                if (offsetParent.tagName.toUpperCase() === 'BODY') {
                    this.movedX -= this.canvas.offsetLeft
                    this.movedY -= this.canvas.offsetTop
                } else {
                    this.movedX -= offsetParent.offsetLeft
                    this.movedY -= offsetParent.offsetTop
                }
            }

            // Delete canvas
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
            // Redraw object
            this.drawExternal()
            this.drawInternal()

            this.excuteCallback()
        }
        
    }

    private onTouchEnd () {
        this.pressed = 0
        console.log('(this.parameters.autoReturnToCenter', this.parameters.autoReturnToCenter)
        
        if (this.parameters.autoReturnToCenter) {
            this.movedX = this.centerX
            this.movedY = this.centerY
        }

        // Delete canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        // Redraw object
        this.drawExternal()
        this.drawInternal()

        this.excuteCallback()
    }

    private onMouseDown () {
        this.pressed = 1
    }

    private onMouseMove (evt: MouseEvent) {
        if (this.pressed === 1) {
            this.movedX = evt.pageX
            this.movedY = evt.pageY

            // Manage offset
            const offsetParent = this.canvas.offsetParent
            if (offsetParent instanceof HTMLDivElement) {
                if (offsetParent.tagName.toUpperCase() === 'BODY') {
                    this.movedX -= this.canvas.offsetLeft
                    this.movedY -= this.canvas.offsetTop
                } else {
                    this.movedX -= offsetParent.offsetLeft
                    this.movedY -= offsetParent.offsetTop
                }
            }

            // Delete canvas
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
            // Redraw object
            this.drawExternal()
            this.drawInternal()

            this.excuteCallback()
        }
    }

    private onMouseUp () {
        this.pressed = 0
        if (this.parameters.autoReturnToCenter) {
            this.movedX = this.centerX
            this.movedY = this.centerY
        }

        // Delete canvas
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        // Redraw object
        this.drawExternal()
        this.drawInternal()

        this.excuteCallback()
    }

    private excuteCallback () {
        // Set attribut of callback
        const status: StickStatus = {
            xPosition: this.movedX,
            yPosition: this.movedY,
            x: 100 * ((this.movedX - this.centerX) / this.maxMoveStick),
            y: (100 * ((this.movedY - this.centerY) / this.maxMoveStick)) * -1,
            cardinalDirection: this.getCardinalDirection() 
        }
        this.callback(status)
    }

    private  getCardinalDirection ()  {
        let result = ''
        const orizontal = this.movedX - this.centerX
        const vertical = this.movedY - this.centerY

        if (vertical >= this.directionVerticalLimitNeg && vertical <= this.directionVerticalLimitPos) {
            result = 'C'
        }

        if (vertical < this.directionVerticalLimitNeg) {
            result = 'N'
        }

        if (vertical > this.directionVerticalLimitPos) {
            result = 'S'
        }

        if (orizontal < this.directionHorizontalLimitNeg) {
            if (result === 'C') {
                result = 'w'
            } else {
                result += 'w'
            }
        }

        if (orizontal > this.directionHorizontalLimitPos) {
            if (result === 'C') {
                result = 'E'
            } else {
                result += 'E'
            }
        }
        return result
    }
    
    /******************************************************
     * Public methods
     *****************************************************/

    /**
     * @desc The width of canvas
     * @return Number of pixel width 
     */
    getWidth () {
        return this.canvas.width
    }

    /**
     * @desc The height of canvas
     * @return Number of pixel height
     */
    getHeight () {
        return this.canvas.height
    }

    /**
     * @desc The X position of the cursor relative to the canvas that contains it and to its dimensions
     * @return Number that indicate relative position
     */
    getPosX () {
        return this.movedX
    }

    /**
     * @desc The Y position of the cursor relative to the canvas that contains it and to its dimensions
     * @return Number that indicate relative position
     */
    getPosY () {
        return this.movedY
    }

    /**
     * @desc Normalizzed value of X move of stick
     * @return Integer from -100 to +100
     */
    getX () {
        return (100 * ((this.movedX - this.centerX) / this.maxMoveStick)).toFixed()
    }

    /**
     * @desc Normalizzed value of Y move of stick
     * @return Integer from -100 to +100
     */
    getY () {
        return ((100 * ((this.movedY - this.centerY) / this.maxMoveStick)) * -1).toFixed()
    }

    /**
     * @desc Get the direction of the cursor as a string that indicates the cardinal points where this is oriented
     * @return String of cardinal point N, NE, E, SE, S, SW, W, NW and C when it is placed in the center
     */
    getDir () {
        return this.getCardinalDirection()
    }

}
