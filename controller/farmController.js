//Farm api
const {Farm} = require('../model/farmModel');

const farmCtr={
    getAllDataFarm: async(req,res)=>{
        try {
            const farms= await Farm.find()
            .populate('valveList');//find all farm
            res.status(200).json(farms);//response farm data 
        } catch (error) {
            res.status(500).json('Error get data farm');
        }
    },
    getFarm: async(req,res)=>{
        try {
            const farm=await Farm.findById(req.params.id);
            res.status(200).json(farm);
        } catch (error) {
            res.status(500).json('Error get data farm');
        }
    },
    createFarm: async(req,res)=>{
        try {
            const newFarm= new Farm(req.body);
            const savedFarm=await newFarm.save();
            res.status(200).json(savedFarm);
        } catch (error) {
            res.status(500).json(error);
        }
    }
};
module.exports= farmCtr;