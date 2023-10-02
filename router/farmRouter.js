const router=require('express').Router();
const control =require('../controller/farmController');

router.get('/allfarm',control.getAllDataFarm);
router.post('/addfarm',control.createFarm);
router.get('/farm/:id',control.getFarm);
module.exports=router;