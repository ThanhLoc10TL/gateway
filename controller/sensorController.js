const { Sensor } = require('../model/sensorModel');

const sensorCtr = {
	getSensorData: async (req, res) => {
		try {
			const dateGet = await Sensor.findById(req.body.timeId);
			res.status(200).json(dateGet.sensorStatus);
		} catch (error) {
			res.status(500).json('Error Get Data Sensor');
		}
	},
    createSensor: async(req,res)=>{
        try {
            const newSensor= new Sensor(req.body);
            const savedSensor=await newSensor.save();
            res.status(200).json(savedSensor);
        } catch (error) {
            res.status(500).json(error);
        }
    }
};

module.exports = sensorCtr;
