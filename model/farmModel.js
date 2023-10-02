const { ObjectId } = require('mongodb');
const mongoose =require('mongoose');
const farmSchema = new mongoose.Schema({
    name: String,
    address: String,
    numberValve: Number,
    valveList: [{
        type: Number,
        ref: 'Valve'
    }],
    idImage: Number,
},{
    collection: 'Farm'
});
let Farm=mongoose.model('Farm',farmSchema);
module.exports={Farm};