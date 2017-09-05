var express = require('express');
var router = express.Router();
var ctrl = require('../ctrl');

/* GET home page. */
router.get('/', ctrl.main);
router.put('/', ctrl.add);
router.post('/draw', ctrl.draw);

module.exports = router;
