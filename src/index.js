class IotServer {
    constructor() {
        this.deviceId = '';
        this.actionId = '';
        this.payload = 10000;
        this.sensors = []
    }

    start(sensorArr) {
        this.sensors.push(sensorArr)
        console.log(this.sensors[0])
    }

    publish(deviceId, actionId, payload) {
        this.deviceId = deviceId;
        this.actionId = actionId;
        this.payload = payload;
        this.start(this)


    }
}

class Sensor {
    constructor(deviceId) {
        this.deviceId = deviceId;
        this.powerStatus = 'off';
        this.status = 'idle';
        this.reportingInterval = 10000;
    }

    turn(v) {
        if (v === 'on') {
            if (this.powerStatus === v) {
                throw new Error("이미 켜져 있습니다.");
            }
            this.powerStatus = v
            setTimeout(() => this.status = 'sensingDistance', this.reportingInterval)
            setTimeout(() => this.status = 'reportingData', this.reportingInterval + 500)
            setTimeout(() => this.status = 'idle', this.reportingInterval + 1500)
        } else if (v === 'off') {
            return this.powerStatus = v
        }
    }
}



module.exports = {
    Sensor,
    IotServer,
};
