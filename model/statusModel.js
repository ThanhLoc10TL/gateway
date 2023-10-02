const { Double } = require('mongodb');
const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
	_id: String,//chia theo giờ/ngày/tháng/năm
	sensor:Number,
	sensorStatus: [//chia theo phút
		{
			timeSave: Number,
			value: {
				temp1: Number,
				temp2: Number,
				humid1: Number,
				humid2: Number,
			},
		},
	],
},
{
    collection:"Status"
});

let Status = mongoose.model('Status', statusSchema);
module.exports = { Status };
