const { Sensor, IotServer } = require('./index');

describe('Sensor 요구사항 테스트', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.clearAllTimers();
    });

    test('꺼져 있는 기기는 언제든 켤 수 있다.', () => {
        const sensor = new Sensor('id1');
        expect(sensor.powerStatus).toEqual('off');

        sensor.turn('on');
        expect(sensor.powerStatus).toEqual('on');
    });

    test('이미 켜져 있는 기기는 또 켤 수 없다.', () => {
        const sensor = new Sensor('id1');
        expect(sensor.powerStatus).toEqual('off');

        sensor.turn('on');
        expect(sensor.powerStatus).toEqual('on');

        expect(() => {
            sensor.turn('on');
        }).toThrow(Error);
    });

    test('기기가 켜지는 즉시 유휴 상태로 들어간다.', () => {
        const sensor = new Sensor('id1');
        sensor.turn('on');

        expect(sensor.status).toEqual('idle');
    });

    test('기기의 reportingInterval 초기 값은 10초여야 한다.', () => {
        const sensor = new Sensor('id1');

        expect(sensor.reportingInterval).toEqual(10000);
    });

    test('기기가 켜져 있는 상태에서는 어떤 동작을 하고 있어도 즉시 끌 수 있어야 한다.', () => {
        const sensor = new Sensor('id1');

        sensor.turn('on');
        expect(sensor.powerStatus).toEqual('on');

        expect(sensor.status).toEqual('idle');
        sensor.turn('off');

        expect(sensor.powerStatus).toEqual('off');
    });

    test('유휴 상태에서 설정된 reportingInterval 값(단위: ms) 만큼 기다린 후 거리 측정을 한다.', () => {
        const sensor = new Sensor('id1');
        sensor.turn('on');

        expect(sensor.status).toEqual('idle');

        jest.advanceTimersByTime(sensor.reportingInterval); // 유휴 대기 시간
        expect(sensor.status).toEqual('sensingDistance');
    });

    test('거리 측정에 걸리는 시간은 항상 500ms 이내여야 한다.', () => {
        const sensor = new Sensor('id1');
        sensor.turn('on');
        jest.advanceTimersByTime(sensor.reportingInterval); // 유휴 대기 시간
        expect(sensor.status).toEqual('sensingDistance');

        jest.advanceTimersByTime(500); // 거리 측정에 걸리는 시간
        expect(sensor.status).toEqual('reportingData');
    });

    test('데이터 보고에 걸리는 시간은 항상 1000ms 이내여야 하며, 데이터 보고 후 유휴 상태로 돌아간다.', () => {
        const sensor = new Sensor('id1');

        sensor.turn('on');
        jest.advanceTimersByTime(sensor.reportingInterval); // 유휴 대기 시간
        expect(sensor.status).toEqual('sensingDistance');

        jest.advanceTimersByTime(500); // 거리 측정에 걸리는 시간
        expect(sensor.status).toEqual('reportingData');

        jest.advanceTimersByTime(1000); // 데이터 보고에 걸리는 시간
        expect(sensor.status).toEqual('idle');
    });

    test('CHANGE_REPORTING_INTERVAL 액션이 발생하면 기기에 설정되어 있던 reportingInterval 값을 전달 받은 값으로 교체해야 한다.', () => {
        const sensor = new Sensor('id1');
        expect(sensor.reportingInterval).toEqual(10000);

        sensor.turn('on');

        const server = new IotServer();
        server.start([sensor]);

        server.publish({
            deviceId: 'id1',
            actionId: 'CHANGE_REPORTING_INTERVAL',
            payload: 3000,
        });
        expect(sensor.reportingInterval).toEqual(3000);
    });

    test('기기가 꺼지면 기기는 서버로 부터 어떠한 이벤트도 수신할 수 없다.', () => {
        const sensor = new Sensor('id1');
        expect(sensor.reportingInterval).toEqual(10000);

        // DO NOT turn on

        const server = new IotServer();
        server.start([sensor]);

        server.publish({
            deviceId: 'id1',
            actionId: 'CHANGE_REPORTING_INTERVAL',
            payload: 3000,
        });

        expect(sensor.reportingInterval).toEqual(10000);
    });
});
