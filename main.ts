microbit_robot.init()
basic.forever(function () {
    microbit_robot.Serial_print("", makerbit.getUltrasonicDistance(DistanceUnit.CM))
    basic.pause(1000)
})
makerbit.connectUltrasonicDistanceSensor(DigitalPin.P5, DigitalPin.P8)
