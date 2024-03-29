namespace microbit_robot {
    // Flag to indicate whether the ESP8266 was initialized successfully.
    let esp8266Initialized = false

    // Buffer for data received from UART.
    let rxData = ""
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
    //% block="ESP8266 initialized"
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
    //% block="initialize ESP8266: Tx %tx Rx %rx Baudrate %baudrate"
    export function init(tx: SerialPin, rx: SerialPin, baudrate: BaudRate) {
        // Redirect the serial port.
        serial.redirect(tx, rx, baudrate)
        serial.setTxBufferSize(128)
        serial.setRxBufferSize(128)

        // Reset the flag.
        esp8266Initialized = false

        // Restore the ESP8266 factory settings.
        // Initialized successfully.
        // Set the flag.
        esp8266Initialized = true
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
    export function  Set_motor(ssid: motor_slot, speed: number) {

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
    export function Set_servo(slot: servo_slot, goc: number) {

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
    export function read_line_sensor(slot: line_slot) {
        // Connect to WiFi router.
        serial.redirect(
            SerialPin.P0,
            SerialPin.P1,
            BaudRate.BaudRate115200
        )
        serial.setTxBufferSize(32)
        serial.setRxBufferSize(32)
        serial.writeLine("C" + slot+";20,")
        a = serial.readUntil(serial.delimiters(Delimiters.Dollar))
        b = parseInt(a, 10)
        return b     
    }
    //% weight=27
    //% blockGap=8
    //% blockId=Serial_print
    //% block="Serial print text: %chff number: %so "
    export function Serial_print(chff: string, so:number) {
        // Connect to WiFi router.
        let data = ""
        data=chff + so
        serial.redirectToUSB()
        serial.writeLine(data)
        // Timeout.
        microbit_robot.init(SerialPin.P0, SerialPin.P1, BaudRate.BaudRate115200)

    }
}