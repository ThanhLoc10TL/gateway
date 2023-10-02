const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const valveSchema= new mongoose.Schema({
    _id: Number,
    farm: String,
    modeManual: String,
    modeAuto: String,
    modeSensor: String,
    dataSensor:String,
    infor: {
        _id: Number,
        status:{
            manual:Number,
            auto:Number,
            sensor:Number,
        },
        sensor:{
            low: Number,
            high:Number, 
        },
        dayObjectList:[{
            day:Number,
            status: Boolean,
            hour: Number,
            minute:Number,
            second:Number,
            timer:Number,
        }]
    }
},{
    collection:"Valve"
})
let Valve= mongoose.model('Valve',valveSchema);
module.exports={ Valve};