/**
 * microbit_robot
 */
//% weight=100 color=#f86909 icon="\uf013"
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
        ping = radio.receivedPacket(RadioPacketProperty.SerialNumber)
        // Reset the flag.
        serial.writeLine("STEMVN%*#"+ping)
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
    export function  Set_motor(ssid: motor_slot, speed: number) {
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
        serial.writeLine("C" + slot +";20,")
        a = serial.readUntil(serial.delimiters(Delimiters.Dollar))
        b = parseInt(a, 10)
        return b     
    }
    let distanceBak = 0;
    /**
     * Get the distance of ultrasonic detection to the obstacle 
     */
    //% weight=90 blockId=startbit_ultrasonic  block="Read ultrasonic|distance(cm)"
    //% subcategory=Sensor
    export function startbit_ultrasonic(): number {
        let echoPin: DigitalPin.P9;
        let trigPin: DigitalPin.P8;
        pins.setPull(echoPin, PinPullMode.PullNone);
        pins.setPull(trigPin, PinPullMode.PullNone);

        pins.digitalWritePin(trigPin, 0);
        control.waitMicros(2);
        pins.digitalWritePin(trigPin, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trigPin, 0);
        control.waitMicros(5);
        let d = pins.pulseIn(echoPin, PulseValue.High, 25000);
        let distance = d;
        // filter timeout spikes
        if (distance == 0 && distanceBak != 0) {
            distance = distanceBak;
        }
        distanceBak = d;

        return Math.round(distance * 10 / 6 / 58 / 1.6);
    }
    //% weight=27
    //% blockGap=8
    //% blockId=Serial_print
    //% block="Serial print text: %chff number: %so "
    //% subcategory=Serial
    export function Serial_print(chff: string, so:number) {
        // Connect to WiFi router.
        let data = ""
        data=chff + so
        serial.redirectToUSB()
        serial.writeLine(data)
        // Timeout.

    }
}