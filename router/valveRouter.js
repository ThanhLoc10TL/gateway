const router= require('express').Router();
const control= require('../controller/valveController')
// [GET]
router.get('/getallvalve/:id',control.getAllDataValve);
router.get('/valve/:farm/:id',control.getValve);
router.post('/valve/add',control.createValve);
router.put('/valveupdate/:id',control.updateValve);
router.put('/valve/porton',control.saveDataFromUart);
module.exports=router;