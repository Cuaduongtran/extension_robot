
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
    export function read_ultra( unit: PingUnit, maxCmDistance = 500): number {
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
    export function Serial_print(buf: string, so:number) {
        // Connect to WiFi router.
        let data =buf+so
        serial.redirectToUSB()
        serial.setTxBufferSize(32)
        serial.setRxBufferSize(32)
        serial.writeLine(data)
    }
    export let NEW_LINE = "\r\n";

    /**
     * Internal use
     */
    //% shim=bluetooth::__log
    export function __log(priority: number, msg: string) {
        return;
    }
    console.addListener(function (_pri, msg) { __log(_pri, msg) });

    /**
    *  Writes to the Bluetooth UART service buffer. From there the data is transmitted over Bluetooth to a connected device.
    */
    //% help=bluetooth/uart-write-string weight=80
    //% blockId=bluetooth_uart_write block="bluetooth uart|write string %data" blockGap=8
    //% parts="bluetooth" shim=bluetooth::uartWriteString advanced=true
    export function uartWriteString(data: string): void {
        console.log(data)
    }

    /**
    *  Writes to the Bluetooth UART service buffer. From there the data is transmitted over Bluetooth to a connected device.
    */
    //% help=bluetooth/uart-write-line weight=79
    //% blockId=bluetooth_uart_line block="bluetooth uart|write line %data" blockGap=8
    //% parts="bluetooth" advanced=true
    export function uartWriteLine(data: string): void {
        uartWriteString(data + serial.NEW_LINE);
    }

    /**
     * Prints a numeric value to the serial
     */
    //% help=bluetooth/uart-write-number weight=79
    //% weight=89 blockGap=8 advanced=true
    //% blockId=bluetooth_uart_writenumber block="bluetooth uart|write number %value"
    export function uartWriteNumber(value: number): void {
        uartWriteString(value.toString());
    }

    /**
     * Writes a ``name: value`` pair line to the serial.
     * @param name name of the value stream, eg: x
     * @param value to write
     */
    //% weight=88 weight=78
    //% help=bluetooth/uart-write-value advanced=true
    //% blockId=bluetooth_uart_writevalue block="bluetooth uart|write value %name|= %value"
    export function uartWriteValue(name: string, value: number): void {
        uartWriteString((name ? name + ":" : "") + value + NEW_LINE);
    }

    /**
     *  Reads from the Bluetooth UART service buffer, returning its contents when the specified delimiter character is encountered.
     */
    //% help=bluetooth/uart-read-until weight=75
    //% blockId=bluetooth_uart_read block="bluetooth uart|read until %del=serial_delimiter_conv"
    //% parts="bluetooth" shim=bluetooth::uartReadUntil advanced=true
    export function uartReadUntil(del: string): string {
        // dummy implementation for simulator
        return ""
    }

    /**
    * Advertise an Eddystone UID
    * @param ns 4 last bytes of the namespace uid
    * @param instance 4 last bytes of the instance uid
    * @param power power level between 0 and 7, eg: 7
    * @param connectable true to keep bluetooth connectable for other services, false otherwise.
    */
    //% blockId=eddystone_advertise_uid block="bluetooth advertise UID|namespace (bytes 6-9)%ns|instance (bytes 2-6)%instance|with power %power|connectable %connectable"
    //% parts=bluetooth weight=12 blockGap=8
    //% help=bluetooth/advertise-uid blockExternalInputs=1
    //% hidden=1 deprecated=1
    export function advertiseUid(ns: number, instance: number, power: number, connectable: boolean) {
        const buf = pins.createBuffer(16);
        buf.setNumber(NumberFormat.Int32BE, 6, ns);
        buf.setNumber(NumberFormat.Int32BE, 12, instance);
        // bluetooth.advertiseUidBuffer(buf, power, connectable);
    }
}
// Auto-generated. Do not edit.


/**
 * Support for additional Bluetooth services.
 */
//% color=#0082FB weight=96 icon="\uf294"
declare namespace bluetooth {

    /**
     *  Starts the Bluetooth accelerometer service
     */
    //% help=bluetooth/start-accelerometer-service
    //% blockId=bluetooth_start_accelerometer_service block="bluetooth accelerometer service"
    //% parts="bluetooth" weight=90 blockGap=8 shim=bluetooth::startAccelerometerService
    function startAccelerometerService(): void;

    /**
     *  Starts the Bluetooth button service
     */
    //% help=bluetooth/start-button-service
    //% blockId=bluetooth_start_button_service block="bluetooth button service" blockGap=8
    //% parts="bluetooth" weight=89 shim=bluetooth::startButtonService
    function startButtonService(): void;

    /**
     *  Starts the Bluetooth IO pin service.
     */
    //% help=bluetooth/start-io-pin-service
    //% blockId=bluetooth_start_io_pin_service block="bluetooth io pin service" blockGap=8
    //% parts="bluetooth" weight=88 shim=bluetooth::startIOPinService
    function startIOPinService(): void;

    /**
     *  Starts the Bluetooth LED service
     */
    //% help=bluetooth/start-led-service
    //% blockId=bluetooth_start_led_service block="bluetooth led service" blockGap=8
    //% parts="bluetooth" weight=87 shim=bluetooth::startLEDService
    function startLEDService(): void;

    /**
     *  Starts the Bluetooth temperature service
     */
    //% help=bluetooth/start-temperature-service
    //% blockId=bluetooth_start_temperature_service block="bluetooth temperature service" blockGap=8
    //% parts="bluetooth" weight=86 shim=bluetooth::startTemperatureService
    function startTemperatureService(): void;

    /**
     *  Starts the Bluetooth magnetometer service
     */
    //% help=bluetooth/start-magnetometer-service
    //% blockId=bluetooth_start_magnetometer_service block="bluetooth magnetometer service"
    //% parts="bluetooth" weight=85 shim=bluetooth::startMagnetometerService
    function startMagnetometerService(): void;

    /**
     *  Starts the Bluetooth UART service
     */
    //% help=bluetooth/start-uart-service
    //% blockId=bluetooth_start_uart_service block="bluetooth uart service"
    //% parts="bluetooth" advanced=true shim=bluetooth::startUartService
    function startUartService(): void;

    /**
     * Sends a buffer of data via Bluetooth UART
     */
    //% shim=bluetooth::uartWriteBuffer
    function uartWriteBuffer(buffer: Buffer): void;

    /**
     * Reads buffered UART data into a buffer
     */
    //% shim=bluetooth::uartReadBuffer
    function uartReadBuffer(): Buffer;

    /**
     * Registers an event to be fired when one of the delimiter is matched.
     * @param delimiters the characters to match received characters against.
     */
    //% help=bluetooth/on-uart-data-received
    //% weight=18 blockId=bluetooth_on_data_received block="bluetooth|on data received %delimiters=serial_delimiter_conv" shim=bluetooth::onUartDataReceived
    function onUartDataReceived(delimiters: string, body: () => void): void;

    /**
     * Register code to run when the micro:bit is connected to over Bluetooth
     * @param body Code to run when a Bluetooth connection is established
     */
    //% help=bluetooth/on-bluetooth-connected weight=20
    //% blockId=bluetooth_on_connected block="on bluetooth connected" blockGap=8
    //% parts="bluetooth" shim=bluetooth::onBluetoothConnected
    function onBluetoothConnected(body: () => void): void;

    /**
     * Register code to run when a bluetooth connection to the micro:bit is lost
     * @param body Code to run when a Bluetooth connection is lost
     */
    //% help=bluetooth/on-bluetooth-disconnected weight=19
    //% blockId=bluetooth_on_disconnected block="on bluetooth disconnected"
    //% parts="bluetooth" shim=bluetooth::onBluetoothDisconnected
    function onBluetoothDisconnected(body: () => void): void;

    /**
     * Advertise an Eddystone URL
     * @param url the url to transmit. Must be no longer than the supported eddystone url length, eg: "https://makecode.com"
     * @param power power level between 0 and 7, eg: 7
     * @param connectable true to keep bluetooth connectable for other services, false otherwise.
     */
    //% blockId=eddystone_advertise_url block="bluetooth advertise url %url|with power %power|connectable %connectable"
    //% parts=bluetooth weight=11 blockGap=8
    //% help=bluetooth/advertise-url blockExternalInputs=1
    //% hidden=1 deprecated=1 shim=bluetooth::advertiseUrl
    function advertiseUrl(url: string, power: int32, connectable: boolean): void;

    /**
     * Advertise an Eddystone UID
     * @param nsAndInstance 16 bytes buffer of namespace (bytes 0-9) and instance (bytes 10-15)
     * @param power power level between 0 and 7, eg: 7
     * @param connectable true to keep bluetooth connectable for other services, false otherwise.
     */
    //% parts=bluetooth weight=12 advanced=true deprecated=1 shim=bluetooth::advertiseUidBuffer
    function advertiseUidBuffer(nsAndInstance: Buffer, power: int32, connectable: boolean): void;

    /**
     * Sets the bluetooth transmit power between 0 (minimal) and 7 (maximum).
     * @param power power level between 0 (minimal) and 7 (maximum), eg: 7.
     */
    //% parts=bluetooth weight=5 help=bluetooth/set-transmit-power advanced=true
    //% blockId=bluetooth_settransmitpower block="bluetooth set transmit power %power" shim=bluetooth::setTransmitPower
    function setTransmitPower(power: int32): void;

    /**
     * Stops advertising Eddystone end points
     */
    //% blockId=eddystone_stop_advertising block="bluetooth stop advertising"
    //% parts=bluetooth weight=10
    //% help=bluetooth/stop-advertising advanced=true
    //% hidden=1 deprecated=1 shim=bluetooth::stopAdvertising
    function stopAdvertising(): void;
}

// Auto-generated. Do not edit. Really.
