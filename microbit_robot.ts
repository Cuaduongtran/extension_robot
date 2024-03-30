
/**
 * microbit_robot
 */
//% weight=100 color=#f86909 icon=""

namespace microbit_robot {
    // Flag to indicate whether the ESP8266 was initialized successfully.
    let esp8266Initialized = false
    // Buffer for data received from UART.
    let rxData = ""
    let ping = 0

    /**
     * Send AT command and wait for response.
     * Return true if expected response is received.
     * @param command The AT command without the CRLF.
     * @param expected_response Wait for this response.
     * @param timeout Timeout in milliseconds.
     */
    //% blockHidden=true
    //% blockId=esp8266_send_command
    /**
     * Return true if the ESP8266 is already initialized.
     */
    //% weight=30
    //% blockGap=8
    //% blockId=esp8266_is_esp8266_initialized
    //% block= STEMVN initialized"
    export function isESP8266Initialized(): boolean {
        return esp8266Initialized
    }
    /**
     * Initialize the ESP8266.
     * @param tx Tx pin of micro:bit. eg: SerialPin.P16
     * @param rx Rx pin of micro:bit. eg: SerialPin.P15
     * @param baudrate UART baudrate. eg: BaudRate.BaudRate115200
     */
    //% weight=29
    //% blockGap=40
    //% blockId=esp8266_init
    //% block="initialize STEMVN microbit robot"
    export function init() {
        // Redirect the serial port.
        basic.pause(100)
        serial.redirect(
            SerialPin.P0,
            SerialPin.P1,
            BaudRate.BaudRate115200
        )
        serial.setTxBufferSize(32)
        serial.setRxBufferSize(32)
        ping = 0
        // Reset the flag.
        serial.writeLine("STEMVN%*#" + ping)
        basic.pause(100)
    }
    export enum motor_slot {
        //% block="M1"
        M1 = "0",
        //% block="M2"
        M2 = "1",
    }
    //% weight=27
    //% blockGap=8
    //% blockId=Set_motor
    //% block="Set motor: %ssid speed %speed"
    //% speed.min=-255 speed.max=255
    //% subcategory=Servo/Motor
    export function Set_motor(ssid: motor_slot, speed: number) {
        serial.redirect(
            SerialPin.P0,
            SerialPin.P1,
            BaudRate.BaudRate115200
        )
        serial.setTxBufferSize(32)
        serial.setRxBufferSize(32)
        // Connect to WiFi router.
        serial.writeLine("M" + ssid + ";" + speed + ",")
        basic.pause(100)
    }
    export enum servo_slot {
        //% block="S1"
        S1 = "1",
        //% block="S2"
        S2 = "2",
        //% block="S3"
        S3 = "3",
    }

    //% weight=27
    //% blockGap=8
    //% blockId=Set_servo
    //% block="Set servo: %slot speed %goc"
    //% goc.min=0 goc.max=180
    //% subcategory=Servo/Motor
    export function Set_servo(slot: servo_slot, goc: number) {
        serial.redirect(
            SerialPin.P0,
            SerialPin.P1,
            BaudRate.BaudRate115200
        )
        serial.setTxBufferSize(32)
        serial.setRxBufferSize(32)
        // Connect to WiFi router.
        serial.writeLine("S" + slot + ";" + goc + ",")
        basic.pause(100)
    }
    export enum line_slot {
        //% block="E1"
        E1 = "1",
        //% block="E2"
        E2 = "2",
        //% block="E3"
        E3 = "3",
        //% block="E4"
        E4 = "4",
        //% block="Light"
        Light = "5",
    }
    let a = ""
    let b = 0
    //% weight=27
    //% blockGap=8
    //% blockId=read_line_sensor
    //% block="Read line sensor: %slot"
    //% subcategory=Sensor
    export function read_line_sensor(slot: line_slot) {
        // Connect to WiFi router.
        serial.redirect(
            SerialPin.P0,
            SerialPin.P1,
            BaudRate.BaudRate115200
        )
        serial.setTxBufferSize(32)
        serial.setRxBufferSize(32)
        serial.writeLine("C" + slot + ";20,")
        a = serial.readUntil(serial.delimiters(Delimiters.Dollar))
        b = parseInt(a, 10)
        return b
    }
    export enum PingUnit {
        //% block="μs"
        MicroSeconds,
        //% block="cm"
        Centimeters,
        //% block="inches"
        Inches
    }
    /**
     * Send a ping and get the echo time (in microseconds) as a result
     * @param trig tigger pin
     * @param echo echo pin
     * @param unit desired conversion unit
     * @param maxCmDistance maximum distance in centimeters (default is 500)
     */
    //% blockId=sonar_ping block="Read Ultrasonic %unit"
    //% subcategory=Sensor
    export function read_ultra(unit: PingUnit, maxCmDistance = 500): number {
        // send pulse
        let trig = DigitalPin.P14
        let echo = DigitalPin.P13
        pins.setPull(trig, PinPullMode.PullNone);
        pins.digitalWritePin(trig, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trig, 0);

        // read pulse
        const d = pins.pulseIn(echo, PulseValue.High, maxCmDistance * 58);

        switch (unit) {
            case PingUnit.Centimeters: return Math.idiv(d, 58);
            case PingUnit.Inches: return Math.idiv(d, 148);
            default: return d;
        }
    }
    //% weight=27
    //% blockGap=8
    //% blockId=Serial_print
    //% block="Serial print text: %buff number: %so "
    //% subcategory=Serial
    export function Serial_print(buf: string, so: number) {
        // Connect to WiFi router.
        let data = buf + so
        serial.redirectToUSB()
        serial.setTxBufferSize(32)
        serial.setRxBufferSize(32)
        serial.writeLine(data)
    }
}
// Auto-generated. Do not edit.

