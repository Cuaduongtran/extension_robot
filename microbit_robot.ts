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
        M1 = "1",
        //% block="M2"
        M2 = "2",
    }
    /**
     * Connect to WiFi router.
     * @param ssid Your WiFi SSID.
     * @param password Your WiFi password.
     */
    //% weight=27
    //% blockGap=8
    //% blockId=esp8266_connect_wifi
    //% block="Set motor: %ssid speed %password"
    export function  Set_motor(ssid: motor_slot, password: number) {

        // Connect to WiFi router.
        serial.writeLine("M" + ssid + ";" + password + ",")
    }

}