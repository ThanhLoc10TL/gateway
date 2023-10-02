const {Status}=require('../model/statusModel');
let saveDataSensor=require('../function/saveDataSensor');

const statusCtr={
    createStatus: async (req,res)=>{
        try {
            console.log(200,req);
            dataSensorObject= {
                sensor:req.body.sensor,
                temp1: req.body.temp1,
                temp2: req.body.temp2,
                humid1: req.body.humid1,
                humid2: req.body.humid2,
            }; 
            await saveDataSensor(dataSensorObject);
            res.status(200).json(dataSensorObject);
        } catch (error) {
            console.log(500,error);
            res.status(500).json(error);
        }
    }
};
module.exports=statusCtr;