var express = require('express');
var router = express.Router();
var ctrl = require('../ctrl');
var passport = require('../passport');


/* GET home page. */
router.get('/', ctrl.main);
router.put('/', ctrl.add);
router.post('/draw', ctrl.draw);


//авторизация
router.get('/login', ctrl.login);
router.post('/login', ctrl.auth);



//подгрузка данных
router.get('/itemType', ctrl.itemType);
router.get('/jobuom', ctrl.jobuom);

//admin routs
router.get('/admin', ctrl.mainAdmin);
router.get('/admin/items/', ctrl.items);
router.get('/admin/jobparams/', ctrl.jobParams);
router.get('/admin/bomparams/', ctrl.bomParams);

//сохранение данных
router.post('/admin/items/', ctrl.addItems);
router.post('/admin/jobparams/', ctrl.addJobParams);

//дулаение итема
router.delete('/delete', ctrl.del);

module.exports = router;
