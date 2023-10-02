const e = require('express');
const {Status} =require('../model/statusModel');

let createSensorData= async(body)=>{
    const status=new Status(body);
    const savedSensor= await status.save();
}

const saveData= async(input)=>{
    let dataSensorInput=input;
    let toDate=new Date();
    //time ID chia theo giờ
    let sensor=dataSensorInput.sensor;
    let timeID= 
        toDate.getDate().toString()+'/'
        +(toDate.getMonth()+1).toString()+'/'
        +toDate.getFullYear().toString()+'/'
        +toDate.getHours().toString()+'/'+sensor;
    let minuteSave= toDate.getMinutes().toString();
    //nếu tồn tại time ID
    let dataSensorAvailable= await Status.findById(timeID);
    if(dataSensorAvailable){
        let lengthSensorData=dataSensorAvailable.sensorStatus.length;
        let findMinuteSave=dataSensorAvailable.sensorStatus.find(function(element){
            return element.timeSave==minuteSave;
        });
        //nếu k tìm được phút đã tạo sensor object mới, nếu đã tồn tại thì không làm gì
        if(!findMinuteSave){
            dataSensorAvailable.sensorStatus.push({
                timeSave:minuteSave,
                value:{
                    temp1:dataSensorInput.temp1,
                    temp2:dataSensorInput.temp2,
                    humid1:dataSensorInput.humid1,
                    humid2:dataSensorInput.humid2,
                }
            });
        }
        for(let i=0;i<lengthSensorData;i++){
            if(dataSensorAvailable.sensorStatus[i].timeSave==minuteSave){
                dataSensorAvailable.sensorStatus[i].value=dataSensorInput;
            }
        }
        dataSensorAvailable.save();
    }
    //nếu không tồn tại time ID thì tạo thêm object mới
    else{
        let Status={
            _id: timeID,
            sensor: dataSensorInput.sensor,
            sensorStatus:[
                {
                    timeSave: minuteSave,
					value: {
						temp1: dataSensorInput.temp1,
						temp2: dataSensorInput.temp2,
						humid1: dataSensorInput.humid1,
						humid2: dataSensorInput.humid2,
					},
                }
            ]
        };
        await createSensorData(Status);
    }
};
module.exports=saveData;