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
    const MICROBIT_MAKERBIT_ULTRASONIC_OBJECT_DETECTED_ID = 798;
    const MAX_ULTRASONIC_TRAVEL_TIME = 300 * DistanceUnit.CM;
    const ULTRASONIC_MEASUREMENTS = 3;

    interface UltrasonicRoundTrip {
        ts: number;
        rtt: number;
    }

    interface UltrasonicDevice {
        trig: DigitalPin | undefined;
        roundTrips: UltrasonicRoundTrip[];
        medianRoundTrip: number;
        travelTimeObservers: number[];
    }

    let ultrasonicState: UltrasonicDevice;

    /**
     * Configures the ultrasonic distance sensor and measures continuously in the background.
     * @param trig pin connected to trig, eg: DigitalPin.P5
     * @param echo pin connected to echo, eg: DigitalPin.P8
     */
    //% subcategory="Ultrasonic"
    //% blockId="makerbit_ultrasonic_connect"
    //% block="connect ultrasonic distance sensor | with Trig at %trig | and Echo at %echo"
    //% trig.fieldEditor="gridpicker"
    //% trig.fieldOptions.columns=4
    //% trig.fieldOptions.tooltips="false"
    //% echo.fieldEditor="gridpicker"
    //% echo.fieldOptions.columns=4
    //% echo.fieldOptions.tooltips="false"
    //% weight=80
    export function connectUltrasonicDistanceSensor(
        trig: DigitalPin,
        echo: DigitalPin
    ): void {
        if (ultrasonicState && ultrasonicState.trig) {
            return;
        }

        if (!ultrasonicState) {
            ultrasonicState = {
                trig: trig,
                roundTrips: [{ ts: 0, rtt: MAX_ULTRASONIC_TRAVEL_TIME }],
                medianRoundTrip: MAX_ULTRASONIC_TRAVEL_TIME,
                travelTimeObservers: [],
            };
        } else {
            ultrasonicState.trig = trig;
        }

        pins.onPulsed(echo, PulseValue.High, () => {
            if (
                pins.pulseDuration() < MAX_ULTRASONIC_TRAVEL_TIME &&
                ultrasonicState.roundTrips.length <= ULTRASONIC_MEASUREMENTS
            ) {
                ultrasonicState.roundTrips.push({
                    ts: input.runningTime(),
                    rtt: pins.pulseDuration(),
                });
            }
        });

        control.inBackground(measureInBackground);
    }

    /**
     * Do something when an object is detected the first time within a specified range.
     * @param distance distance to object, eg: 20
     * @param unit unit of distance, eg: DistanceUnit.CM
     * @param handler body code to run when the event is raised
     */
    //% subcategory="Ultrasonic"
    //% blockId=makerbit_ultrasonic_on_object_detected
    //% block="on object detected once within | %distance | %unit"
    //% weight=69
    const enum DistanceUnit {
        //% block="cm"
        CM = 58, // Duration of echo round-trip in Microseconds (uS) for two centimeters, 343 m/s at sea level and 20°C
        //% block="inch"
        INCH = 148, // Duration of echo round-trip in Microseconds (uS) for two inches, 343 m/s at sea level and 20°C
    }
    export function onUltrasonicObjectDetected(
        distance: number,
        unit: DistanceUnit,
        handler: () => void
    ) {
        if (distance <= 0) {
            return;
        }

        if (!ultrasonicState) {
            ultrasonicState = {
                trig: undefined,
                roundTrips: [{ ts: 0, rtt: MAX_ULTRASONIC_TRAVEL_TIME }],
                medianRoundTrip: MAX_ULTRASONIC_TRAVEL_TIME,
                travelTimeObservers: [],
            };
        }

        const travelTimeThreshold = Math.imul(distance, unit);

        ultrasonicState.travelTimeObservers.push(travelTimeThreshold);

        control.onEvent(
            MICROBIT_MAKERBIT_ULTRASONIC_OBJECT_DETECTED_ID,
            travelTimeThreshold,
            () => {
                handler();
            }
        );
    }

    /**
     * Returns the distance to an object in a range from 1 to 300 centimeters or up to 118 inch.
     * The maximum value is returned to indicate when no object was detected.
     * -1 is returned when the device is not connected.
     * @param unit unit of distance, eg: DistanceUnit.CM
     */
    //% subcategory="Ultrasonic"
    //% blockId="makerbit_ultrasonic_distance"
    //% block="ultrasonic distance in %unit"
    //% weight=60
    export function getUltrasonicDistance(unit: DistanceUnit): number {
        if (!ultrasonicState) {
            return -1;
        }
        basic.pause(0); // yield to allow background processing when called in a tight loop
        return Math.idiv(ultrasonicState.medianRoundTrip, unit);
    }

    /**
     * Returns `true` if an object is within the specified distance. `false` otherwise.
     *
     * @param distance distance to object, eg: 20
     * @param unit unit of distance, eg: DistanceUnit.CM
     */
    //% subcategory="Ultrasonic"
    //% blockId="makerbit_ultrasonic_less_than"
    //% block="ultrasonic distance is less than | %distance | %unit"
    //% weight=50
    export function isUltrasonicDistanceLessThan(
        distance: number,
        unit: DistanceUnit
    ): boolean {
        if (!ultrasonicState) {
            return false;
        }
        basic.pause(0); // yield to allow background processing when called in a tight loop
        return Math.idiv(ultrasonicState.medianRoundTrip, unit) < distance;
    }

    function triggerPulse() {
        // Reset trigger pin
        pins.setPull(ultrasonicState.trig, PinPullMode.PullNone);
        pins.digitalWritePin(ultrasonicState.trig, 0);
        control.waitMicros(2);

        // Trigger pulse
        pins.digitalWritePin(ultrasonicState.trig, 1);
        control.waitMicros(10);
        pins.digitalWritePin(ultrasonicState.trig, 0);
    }

    function getMedianRRT(roundTrips: UltrasonicRoundTrip[]) {
        const roundTripTimes = roundTrips.map((urt) => urt.rtt);
        return median(roundTripTimes);
    }

    // Returns median value of non-empty input
    function median(values: number[]) {
        values.sort((a, b) => {
            return a - b;
        });
        return values[(values.length - 1) >> 1];
    }

    function measureInBackground() {
        const trips = ultrasonicState.roundTrips;
        const TIME_BETWEEN_PULSE_MS = 145;

        while (true) {
            const now = input.runningTime();

            if (trips[trips.length - 1].ts < now - TIME_BETWEEN_PULSE_MS - 10) {
                ultrasonicState.roundTrips.push({
                    ts: now,
                    rtt: MAX_ULTRASONIC_TRAVEL_TIME,
                });
            }

            while (trips.length > ULTRASONIC_MEASUREMENTS) {
                trips.shift();
            }

            ultrasonicState.medianRoundTrip = getMedianRRT(
                ultrasonicState.roundTrips
            );

            for (let i = 0; i < ultrasonicState.travelTimeObservers.length; i++) {
                const threshold = ultrasonicState.travelTimeObservers[i];
                if (threshold > 0 && ultrasonicState.medianRoundTrip <= threshold) {
                    control.raiseEvent(
                        MICROBIT_MAKERBIT_ULTRASONIC_OBJECT_DETECTED_ID,
                        threshold
                    );
                    // use negative sign to indicate that we notified the event
                    ultrasonicState.travelTimeObservers[i] = -threshold;
                } else if (
                    threshold < 0 &&
                    ultrasonicState.medianRoundTrip > -threshold
                ) {
                    // object is outside the detection threshold -> re-activate observer
                    ultrasonicState.travelTimeObservers[i] = -threshold;
                }
            }

            triggerPulse();
            basic.pause(TIME_BETWEEN_PULSE_MS);
        }
    }
}