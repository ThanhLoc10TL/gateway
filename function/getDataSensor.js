const getDataSensor=(rawDataSensor)=>{
    // a,1,1667814614,0,0,0,0,0,0
    // a,1,0,0,0,0,0,0
    let id=Number(rawDataSensor.slice(2,3))
    let dataSensor=rawDataSensor.slice(8)
    //dataSensor: a,b,c,d
    //data= tem1/humid1/tem2/humid2
    let dataHumid1 = parseFloat(dataSensor.slice(0,dataSensor.indexOf(',')))/10
    //console.log(150,dataTemp1)
    dataSensor=dataSensor.slice(dataSensor.indexOf(',')+1)
    let dataTemp1=parseFloat(parseFloat(dataSensor.slice(0,dataSensor.indexOf(',')))/10)
    //console.log(150,dataHumid1)
    dataSensor=dataSensor.slice(dataSensor.indexOf(',')+1)
    let dataTemp2= parseFloat(parseFloat(dataSensor.slice(0,dataSensor.indexOf(',')))/10)
    //console.log(150,dataTemp2)
    let dataHumid2=parseFloat(parseFloat(dataSensor.slice(dataSensor.indexOf(',')+1))/10)
    console.log(150,dataHumid2)
    // if(dataHumid1 == 101 & dataTemp1 == 0)
    // {
    //     console(150, 'NODE' + id + ':' + 'SENSOR 1 NOT INSTALL')
    // }

    // if(dataHumid2 == 101 & dataTemp2 == 0)
    // {
    //     console(150, 'NODE' + id + ':' + 'SENSOR 2 NOT INSTALL')
    // }
    // if(Math.abs(dataTemp1 - dataTemp2) > 2 | Math.abs(dataHumid1 - dataHumid2) > 7)
    // {
    //     console(160, 'NODE' + id + ':' + 'VALUE INCORRECT')
    // }
    
    return dataSensorObject={
        sensor:id,
        temp1:dataTemp1,
        temp2:dataTemp2,
        humid1:dataHumid1,
        humid2:dataHumid2,
    };
}
module.exports=getDataSensor;