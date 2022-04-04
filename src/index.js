class IotServer {
    constructor() {
        this.sensors = []
    }

    start([sensorArr]) {
        this.sensors.push(sensorArr)
    }

//구조분해할당 객체를 보낼 때는 중괄호 싸서 받아야 각각의 key를 사용해서 그에 맞는 value 사용 가능
    publish({deviceId, actionId, payload}) {
        this.deviceId = deviceId;
        this.actionId = actionId;
        this.payload = payload;
        if (this.sensors[0].powerStatus === 'on') {
            if (deviceId === this.deviceId && actionId === 'CHANGE_REPORTING_INTERVAL') {
                this.sensors[0].reportingInterval = payload
            }
        }
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