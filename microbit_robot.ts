
/**
 * microbit_robot
 */
//% weight=100 color=#f86909 icon=""

namespace microbit_robot {
    // Flag to indicate whether the ESP8266 was initialized successfully.
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
}
// Auto-generated. Do not edit.

