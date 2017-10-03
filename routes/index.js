var express = require('express');
var router = express.Router();
var ctrl = require('../ctrl');
var passport = require('../passport');



function auth(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }else{
        res.redirect('/login');
    }
}

function authAdm(req, res, next) {
    if (req.isAuthenticated() && req.user[0].TOP_USER_LEVEL === 1) {
        return next();
    }else{
        res.redirect('/');
    }
}

function guest(req, res, next) {

    if (req.isAuthenticated()) {
        return next();
    }else{
        res.redirect('/login');
    }
}

/* GET home page. */
router.get('/', auth, ctrl.main);
router.get('/res/:id', authAdm, ctrl.mainRes);
router.put('/', auth, ctrl.add);
router.post('/draw', auth, ctrl.mainRady);
router.post('/drawAdmin', authAdm, ctrl.mainResAjax);


//авторизация
router.get('/login', ctrl.login);
router.post('/login', ctrl.auth);
router.get('/logout', ctrl.logout);

//регистрация
//router.get('/registration', ctrl.registration);
//router.post('/registration', ctrl.reg);



//подгрузка данных
router.get('/itemType', ctrl.itemType);
router.get('/jobuom', ctrl.jobuom);
router.get('/items',  ctrl.item);
router.get('/selectitems',  ctrl.SelectItems);
router.get('/selectbomparams',  ctrl.SelectBomParams);
router.get('/selectjobparams',  ctrl.SelectJobParams);
router.get('/location',  ctrl.location);
router.get('/users',  ctrl.getUsers);

//admin routs
router.get('/admin', authAdm, ctrl.mainAdmin);
router.get('/admin/items/', authAdm, ctrl.items);
router.get('/admin/jobparams/', authAdm, ctrl.jobParams);
router.get('/admin/bomparams/', authAdm, ctrl.bomParams);
router.get('/admin/uom/', authAdm,  ctrl.uom);
router.get('/admin/top_users/', authAdm,  ctrl.top_users);
router.get('/admin/saveItems/', authAdm,  ctrl.saveItems);

//сохранение данных
router.post('/admin/items/',  ctrl.addItems);
router.post('/admin/jobparams/',  ctrl.addJobParams);
router.post('/admin/bomparams/',  ctrl.addBomParams);
router.post('/admin/uom/',  ctrl.addUom);
router.post('/admin/top_users/',  ctrl.addUsers);

//обновление данных
router.put('/admin/items',  ctrl.updateItems);
router.put('/admin/jobparams',  ctrl.updateJobParams);
router.put('/admin/bomparams',  ctrl.updateBomParams);

//дулаение итема
router.delete('/delete',  ctrl.del);

module.exports = router;
