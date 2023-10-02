const processDataToSlave=(dataObjectFromApp)=>{
    let dataObject=dataObjectFromApp;
    let manual,auto,sensor,lowThreshold,highThreshold,id;
    id=dataObject._id;
    manual=dataObject.infor.status.manual.toString();
    auto=dataObject.infor.status.auto.toString();
    sensor=dataObject.infor.status.sensor.toString();
    lowThreshold=dataObject.infor.sensor.high;
    highThreshold=dataObject.infor.sensor.low;
    let dataSendToSlaveObject={
        id:id,
        manual: manual,
        auto: auto,
        sensor:sensor,
        low: lowThreshold,
        high: highThreshold,
    }
    //console.log(200,dataSendToSlaveObject)
    return dataSendToSlaveObject
};
module.exports= processDataToSlave;