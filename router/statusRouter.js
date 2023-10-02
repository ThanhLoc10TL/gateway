const router= require('express').Router();
const control= require('../controller/statusController')
// [GET]
router.post('/addstatus',control.createStatus);
module.exports=router;