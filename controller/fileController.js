//const {Farm} = require('../model/farmModel');
const dir = 'D:/ftpserver/cam1/'
const fs = require("fs")
const fileCtr={
    getFile: async(req,res)=>{
        try {
            let dayReq=req.params.day
            let path=dir+dayReq+ "/video"
            var arr=[]
            var count=0
            fs.readdir(path, (err, files) => {
                if (err) {
                  throw err
                }
                files.forEach(file => {
                  arr[count]=file;
                  count++;
                  console.log(file)
                })
                console.log(arr);
                res.status(200).json(arr)
              })
            
        } catch (error) {
            console.log('Error')
            res.status(404).json('Error'+error)
        }
    }
}
module.exports=fileCtr