//Chứa các hàm được gọi đến khi call api trong router
const { Farm } = require('../model/farmModel');
const {Valve} =require('../model/valveModels');
let saveDataValve=require('../function/saveDataValve')

const valveCtr={
    updateValve:async(req,res)=>{
        try {
            const valve=await Valve.findOne({_id:req.params.id});
            await valve.updateOne({
                $set: req.body
            });
            return res.status(200).json('update successfully');
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    getAllDataValve: async(req,res)=>{
        try {
            const farm=await Farm.findById(req.params.id).populate('valveList');
            let valves=farm.valveList;
            res.status(200).json(valves);
        } catch (error) {
            res.status(500).json('Error get all valve data');
        }
    },
    getValve: async(req,res)=>{
        try {
            const aValve=await Valve.findOne({_id: req.params.id,farm: req.params.farm});
            res.status(200).json(aValve);
        } catch (error) {
            res.status(500).json('Error get valve data'+error)
            
        }
    },
    createValve: async(req,res)=>{
        try {
            const newValve=new Valve(req.body);
            const savedValve=await newValve.save();
            if(req.body.farm){
                const farm=await Farm.findById(req.body.farm);
                if(farm!=null){
                    await farm.updateOne({$push:{valveList:savedValve._id}});
                } else{
                    savedValve.farm="New Farm";
                    await savedValve.save();
                }
            }
            res.status(200).json(savedValve);
        } catch (error) {
            res.status(500).json(error);
        }
    },
    //hàm test chức năng update giá trị valve object khi nhận giá trị từ port on
    saveDataFromUart: async(req,res)=>{
        try {
            dataSlaveObject={
                _id: req.body._id,
                modeManual: req.body.modeManual,
                modeAuto: req.body.modeAuto,
                modeSensor:req.body.modeSensor,
                dataSensor:req.body.dataSensor,
            }
            await saveDataValve(dataSlaveObject);
            res.status(200).json(dataSlaveObject);
        } catch (error) {
            res.status(500).json(error);
        }
    }
};
module.exports=valveCtr;