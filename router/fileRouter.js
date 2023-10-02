const router=require('express').Router();
const control =require('../controller/fileController');

router.get('/allfile/:day',control.getFile);

module.exports=router;