const mongoose=require('mongoose');
const { Status } = require('./statusModel');

const sensorSchema=new mongoose.Schema({
    _id: Number,
	status:[
        {
            type:String,
            ref: Status,
        }
    ]
},{
    collection:'Sensor'
})
let Sensor=mongoose.model('Sensor',sensorSchema);
module.exports={Sensor};