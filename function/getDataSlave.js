//hàm xử lý chuỗi ký tự nhận từ slave đưa vào object
const getDataSlave = (rawDataSensor) => {
    /* 
    Xử lý raw data => Data send to slave
    */
    // res2,1667285447,0,0,295,0,0,0 
    // a,1,0,0,0,0,0,0
    let id = Number(rawDataSensor.slice(2, 3))
    let statusManual = Number(rawDataSensor.slice(4, 5))
    let statusSensor = Number(rawDataSensor.slice(6, 7))
    let dataSensor = rawDataSensor.slice(8)
    //dataSensor: a,b,c,d
    //data= tem1/humid1/tem2/humid2
    let dataHumid1 = parseFloat(dataSensor.slice(0, dataSensor.indexOf(','))) / 10
    dataSensor = dataSensor.slice(dataSensor.indexOf(',') + 1)
    let dataTemp1 = parseFloat(dataSensor.slice(0, dataSensor.indexOf(','))) / 10
    dataSensor = dataSensor.slice(dataSensor.indexOf(',') + 1)
    let dataTemp2 = parseFloat(dataSensor.slice(0, dataSensor.indexOf(','))) / 10
    dataSensor = dataSensor.slice(dataSensor.indexOf(',') + 1)
    let dataHumid2 = parseFloat(dataSensor.slice(0, dataSensor.indexOf(','))) / 10
    dataSensor = dataSensor.slice(dataSensor.indexOf(','))

    let statusSubValveStr = Number(dataSensor.slice(1, dataSensor.indexOf(';')))
    let statusSubValve = [0, 0, 0, 0]
    if ((statusSubValveStr & 1) != 0)
        statusSubValve[0] = 1
    else if ((statusSubValveStr & 1) == 0) statusSubValve[0] = 0
    if ((statusSubValveStr & 2) != 0)
        statusSubValve[1] = 1
    else if ((statusSubValveStr & 2) == 0) statusSubValve[1] = 0
    if ((statusSubValveStr & 4) != 0)
        statusSubValve[2] = 1
    else if ((statusSubValveStr & 4) == 0) statusSubValve[2] = 0
    if ((statusSubValveStr & 8) != 0)
        statusSubValve[3] = 1
    else if ((statusSubValveStr & 8) == 0) statusSubValve[3] = 0


    if (dataHumid1 == 101 | dataTemp1 == 101) {
        console.log(150, 'NODE' + id + ':' + 'SENSOR 1 NOT INSTALL')
    }

    if (dataHumid2 == 101 & dataTemp2 == 101) {
        console.log(150, 'NODE' + id + ':' + 'SENSOR 2 NOT INSTALL')
    }
    if (Math.abs(dataTemp1 - dataTemp2) > 2 | Math.abs(dataHumid1 - dataHumid2) > 7) {
        console.log(160, 'NODE' + id + ':' + 'VALUE INCORRECT')
    }
    let dataSendToSlave = {
        _id: id,
        modeManual: statusManual == 1 ? "manual_on" : "manual_off",
        modeSensor: statusSensor == 1 ? "sensor_on" : "sensor_off",
        dataSensor: dataTemp1 + "-" + dataTemp2 + "|" + dataHumid1 + "-" + dataHumid2,
        statusValve: {
            valve1: statusSubValve[0],
            valve2: statusSubValve[1],
            valve3: statusSubValve[2],
            valve4: statusSubValve[3],
        }
    }
    if (dataSendToSlave != null) {
        return dataSendToSlave;
    }
    else return false;
}
module.exports = getDataSlave;