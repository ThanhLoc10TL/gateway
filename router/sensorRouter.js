const router = require('express').Router();
const control = require('../controller/sensorController');

router.get('/sensor', control.getSensorData);
router.post('/addsensor',control.createSensor);

module.exports = router;
