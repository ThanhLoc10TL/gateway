const {Valve} =require('../model/valveModels');

const saveDataValve=async(input)=>{
    let dataSlaveInput=input;
    const valve=await Valve.findOne({_id:dataSlaveInput._id});
    if(valve){
        await valve.updateOne({
            $set: dataSlaveInput
        })
    }
};
module.exports=saveDataValve;