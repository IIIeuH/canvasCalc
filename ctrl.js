var oracledb = require('oracledb');
var async    = require('async');
var flash = require('connect-flash');
var passport    = require('./passport');
var bcrypt          = require('./crypto');
module.exports.main = function(req, res, next) {
    res.cookie('user', req.user[0].TOP_USER_ID);
    getData(req, function(data){
        res.render('index', { title: 'Express', data: data, user: req.user[0]});
    });
};

module.exports.mainRady = function(req, res, next) {
    getDataRady(req, function(data){
        res.send(data)
    });
};

module.exports.login = function(req, res, next) {
    res.render('login', { title: 'Авторизация', message: req.flash('message') });
};
module.exports.logout = function(req, res, next) {
    req.logout();
    res.redirect('/');
};

// module.exports.registration = function(req, res, next) {
//     getLocation(function(items){
//         res.render('registration', { title: 'Регистрация', location: items});
//     });
// };

module.exports.reg =
    passport.authenticate('local-reg',
        {
            successRedirect: '/login',
            failureRedirect: '/registration',
            failureFlash: true
        });


module.exports.auth = passport.authenticate('local',
    {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    });
        //res.render('login', { title: 'Авторизация', message: 'Пароль введен не верно!'});

module.exports.mainAdmin = function(req, res, next){
    res.render('admin', { title: 'Административная панель'});
};

module.exports.items = function(req, res, next){
    getItems(function(items){
        res.render('items', { title: 'Параметры материала', items: items});
    });
};

module.exports.SelectBomParams = function(req, res, next){
    getBomParams(function(items){
        res.json(items);
    });
};


module.exports.SelectJobParams = function(req, res, next){
    getJobParams(function(jobParams){
      res.json(jobParams);
    })
};

module.exports.SelectItems = function(req, res, next){
    getItems(function(items){
        res.json(items);
    });
};

module.exports.item = function(req, res, next){
    getItems(function(items){
        res.json(items);
    });
};

module.exports.uom = function(req, res, next){
    getUoms(function(items){
        res.render('uom', { title: 'Единицы измерения', items: items});
    });
};

module.exports.top_users = function(req, res, next){
    getUsers(function(users){
        res.render('top_users', { title: 'Пользователи', items: users});
    });
};

module.exports.itemType = function(req, res, next){
    getItemType(function(data){
        res.json(data);
    });
};

module.exports.addItems = function(req, res, next){
    saveItems(req.body.data, req.body.col,  function(data){
        res.json(data);
    });
};

module.exports.addJobParams = function(req, res, next){
    saveJobParams(req.body.data, req.body.col,  function(data){
        res.json(data);
    });
};
module.exports.addBomParams = function(req, res, next){
    saveBomParams(req.body.data, req.body.col,  function(data){
        res.json(data);
    });
};

module.exports.addUom = function(req, res, next){
    saveUom(req.body.data, req.body.col,  function(data){
        res.json(data);
    });
};

module.exports.addUsers = function(req, res, next){
    saveUsers(req.body.data, req.body.col,  function(data){
        res.json(data);
    });
};

module.exports.jobuom = function(req, res, next){
    getJobuom(function(data){
        res.json(data);
    });
};

module.exports.location = function(req, res, next){
    getLocation(function(data){
        res.json(data);
    });
};

module.exports.jobParams = function(req, res, next){
    getJobParams(function(jobParams){
        res.render('jobparams', { title: 'Параметры работ', jobParams: jobParams});
    });
};


module.exports.bomParams = function(req, res, next){
    getBomParams(function(bomParams){
        res.render('bomparams', { title: 'Спецификация', bomParams: bomParams});
    });
};

module.exports.del = function(req, res, next){
    console.log(req.body);
    delItems(req.body.id, req.body.table, req.body.nameId, function(data){
        res.json(data);
    });
};
module.exports.updateItems = function(req, res, next) {
    updateItems(req.body.data, req.body.id, 'items', function (data) {
        res.json(data);
    })
};

module.exports.updateJobParams = function(req, res, next) {
    updateJobParams(req.body.data, req.body.id, 'jobparams', function (data) {
        res.json(data);
    })
};
module.exports.updateBomParams = function(req, res, next) {
    updateBomParams(req.body.data, req.body.id, 'bomparams', function (data) {
        res.json(data);
    })
};


module.exports.add = function(req, res, next) {
    async.waterfall([
        function physicsParam(cb){
            oracledb.getConnection(
                {
                    user: "tops",
                    password: "tops",
                    connectString: "(DESCRIPTION =(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = webdb.terracorp.ru)(PORT = 1521)))(CONNECT_DATA = (SID = WEBDB)(SERVER = DEDICATED)))"
                },
                function (err, connection) {
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                    var itemid = +req.body.itemId;
                    var query = "merge into contertops a using(select :countertops_id countertops_id, :itemid itemid, :width width, :heigth heigth, :section section, :joint_vertical joint_vertical, :joint_horizontal joint_horizontal, :comments comments, :top_name top_name, :section_side section_side, :section_height section_height, :bottom_glue_width bottom_glue_width, :price price, :top_user_id top_user_id, :saved saved from dual) b ON (a.countertops_id=b.countertops_id and b.countertops_id != 0) WHEN matched then update  SET a.itemid=b.itemid,  a.width=b.width,  a.heigth=b.heigth,  a.section=b.section,  a.joint_vertical=b.joint_vertical,  a.joint_horizontal=b.joint_horizontal,  a.comments=b.comments,  a.top_name=b.top_name,  a.section_side=b.section_side,  a.section_height=b.section_height,  a.bottom_glue_width=b.bottom_glue_width,  a.price=b.price,  a.top_user_id=b.top_user_id, a.saved=b.saved when not matched then insert  (itemid,   width,   heigth,   section,   joint_vertical,   joint_horizontal,   comments,   top_name,   section_side,   section_height,   bottom_glue_width,   price,   top_user_id, saved)  values  (b.itemid,   b.width,   b.heigth,   b.section,   b.joint_vertical,   b.joint_horizontal,   b.comments,   b.top_name,   b.section_side,   b.section_height,   b.bottom_glue_width,   b.price,   b.top_user_id, b.saved)";
                    connection.execute(
                        query, [req.body.counterTopId, itemid, req.body.width, req.body.heigth, req.body.section, req.body.joinVertical, req.body.joinHorizontal, req.body.comments, req.body.name, req.body.sectionSide, req.body.sectionHeight, req.body.bottomGlueWidth, req.body.price, req.user[0].TOP_USER_ID, 1], {autoCommit: true},
                        function (err, result) {
                            if (err) {
                                doRelease(connection);
                                cb(err);
                            }
                            doRelease(connection);
                            cb(null);
                        });
                });
        },
        function retId(cb) {
            oracledb.getConnection(
                {
                    user: "tops",
                    password: "tops",
                    connectString: "(DESCRIPTION =(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = webdb.terracorp.ru)(PORT = 1521)))(CONNECT_DATA = (SID = WEBDB)(SERVER = DEDICATED)))"
                },
                function (err, connection) {
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                    if(req.body.counterTopId !== '0'){
                        cb(null, req.body.counterTopId);
                    }else{
                        var query = "SELECT MAX(countertops_id) as maxid FROM contertops";
                        connection.execute(
                            query, {}, {outFormat: oracledb.OBJECT},
                            function (err, result) {
                                if (err) {
                                    doRelease(connection);
                                    console.log(err);
                                    cb(err);
                                }
                                doRelease(connection);
                                cb(null, result.rows[0].MAXID);
                            });
                    }
                })
        },
        function paramsSanteh(counterTopId, cb ) {
            oracledb.getConnection(
                {
                    user: "tops",
                    password: "tops",
                    connectString: "(DESCRIPTION =(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = webdb.terracorp.ru)(PORT = 1521)))(CONNECT_DATA = (SID = WEBDB)(SERVER = DEDICATED)))"
                },
                function (err, connection) {
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                    console.log('COUNTEMDDS', counterTopId);
                    var query = "merge into countertops_addon a using (select :COUNTERTOPS_ADDON_ID COUNTERTOPS_ADDON_ID,:ADDON_TYPE_ID ADDON_TYPE_ID, :COUNTERTOPS_ID COUNTERTOPS_ID, :ADDON_X ADDON_X, :ADDON_Y ADDON_Y, :ADDON_A ADDON_A, :ADDON_B ADDON_B, :BOTTOM_MOUNT BOTTOM_MOUNT from dual) b on (a.COUNTERTOPS_ADDON_ID=b.COUNTERTOPS_ADDON_ID and a.COUNTERTOPS_ID=b.COUNTERTOPS_ID and b.COUNTERTOPS_ID != 0) when matched then update set a.ADDON_TYPE_ID=b.ADDON_TYPE_ID, a.ADDON_X=b.ADDON_X, a.ADDON_Y=b.ADDON_Y, a.ADDON_A=b.ADDON_A, a.ADDON_B=b.ADDON_B, a.BOTTOM_MOUNT=b.BOTTOM_MOUNT when not matched then insert (ADDON_TYPE_ID, COUNTERTOPS_ID, ADDON_X, ADDON_Y, ADDON_A, ADDON_B, BOTTOM_MOUNT) values (b.ADDON_TYPE_ID, b.COUNTERTOPS_ID, b.ADDON_X, b.ADDON_Y, b.ADDON_A, b.ADDON_B, b.BOTTOM_MOUNT)";
                    connection.execute(
                        query, [req.body.moiFormId, req.body.moiForm, counterTopId, req.body.coordinatesX, req.body.coordinatesY, (req.body.diameter || req.body.sideA || req.body.lots), (req.body.sideB || req.body.sal), req.body.bottomMounting], {autoCommit: true},
                        function (err, result) {
                            if (err) {
                                console.log(err);
                                doRelease(connection);
                                cb(err);
                            }
                            doRelease(connection);
                            cb(null, counterTopId);
                        });
                })
        },
        function saveDop(counterTopId, cb ) {
            oracledb.getConnection(
                {
                    user: "tops",
                    password: "tops",
                    connectString: "(DESCRIPTION =(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = webdb.terracorp.ru)(PORT = 1521)))(CONNECT_DATA = (SID = WEBDB)(SERVER = DEDICATED)))"
                },
                function (err, connection) {
                    if (err) {
                        console.error(err.message);
                        return;
                    }
                    var res = JSON.parse(req.body.dop);
                    async.forEachOf(res, function(item, k, done){
                        var query = "merge into countertops_addon a using (select :COUNTERTOPS_ADDON_ID COUNTERTOPS_ADDON_ID,:ADDON_TYPE_ID ADDON_TYPE_ID, :COUNTERTOPS_ID COUNTERTOPS_ID, :ADDON_X ADDON_X, :ADDON_Y ADDON_Y, :ADDON_A ADDON_A, :ADDON_B ADDON_B, :BOTTOM_MOUNT BOTTOM_MOUNT from dual) b on (a.COUNTERTOPS_ADDON_ID=b.COUNTERTOPS_ADDON_ID and a.COUNTERTOPS_ID=b.COUNTERTOPS_ID and b.COUNTERTOPS_ID!=0) when matched then update set a.ADDON_TYPE_ID=b.ADDON_TYPE_ID, a.ADDON_X=b.ADDON_X, a.ADDON_Y=b.ADDON_Y, a.ADDON_A=b.ADDON_A, a.ADDON_B=b.ADDON_B, a.BOTTOM_MOUNT=b.BOTTOM_MOUNT when not matched then insert (ADDON_TYPE_ID, COUNTERTOPS_ID, ADDON_X, ADDON_Y, ADDON_A, ADDON_B, BOTTOM_MOUNT) values (b.ADDON_TYPE_ID, b.COUNTERTOPS_ID, b.ADDON_X, b.ADDON_Y, b.ADDON_A, b.ADDON_B, b.BOTTOM_MOUNT)";
                        connection.execute(
                            query, [item.dopId, 9999, counterTopId, item.inputX, item.inputY, item.inputD, null, null], {autoCommit: true},
                            function (err, result) {
                                if (err) {
                                    console.log(err);
                                    doRelease(connection);
                                    cb(err);
                                }
                                doRelease(connection);
                                done();
                            });
                    }, function(err){
                        if(err) console.log(err);
                        cb(null);
                    });
                })
        }
    ], function(err, result){
        if(err) {
            res.json(err);
        }
        res.json('Данные успешно записаны в CONTERTOPS!');
    });
};

function getData(req, cb) {
    oracledb.getConnection(
        {
            user: "tops",
            password: "tops",
            connectString: "(DESCRIPTION =(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = webdb.terracorp.ru)(PORT = 1521)))(CONNECT_DATA = (SID = WEBDB)(SERVER = DEDICATED)))"
        },
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            var query = "SELECT * FROM contertops WHERE top_user_id = " + req.user[0].TOP_USER_ID;
            connection.execute(
                query, {}, { outFormat: oracledb.OBJECT},
                function (err, ress) {
                    if (err) {
                        console.error(err);
                        doRelease(connection);
                        cb(err);
                    }
                    if(ress.rows.length){
                        var query = "SELECT * FROM countertops_addon WHERE countertops_id ="+ress.rows[0].COUNTERTOPS_ID;
                        connection.execute(
                            query, {}, { outFormat: oracledb.OBJECT},
                            function (err, result) {
                                if (err) {
                                    console.error(err);
                                    doRelease(connection);
                                }
                                doRelease(connection);
                                ress.rows.push(result.rows);
                                cb(ress.rows);
                            });
                    }else{
                        doRelease(connection);
                        cb(ress.rows);
                    }
                });
        });
}

function getDataRady(req, cb) {
    oracledb.getConnection(
        {
            user: "tops",
            password: "tops",
            connectString: "(DESCRIPTION =(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = webdb.terracorp.ru)(PORT = 1521)))(CONNECT_DATA = (SID = WEBDB)(SERVER = DEDICATED)))"
        },
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            var query = "SELECT * FROM contertops WHERE top_user_id = " + req.user[0].TOP_USER_ID+" AND countertops_id =" + req.body.id;
            connection.execute(
                query, {}, { outFormat: oracledb.OBJECT},
                function (err, ress) {
                    if (err) {
                        console.error(err);
                        doRelease(connection);
                        cb(err);
                    }
                    if(ress.rows.length){
                        var query = "SELECT * FROM countertops_addon WHERE countertops_id ="+ress.rows[0].COUNTERTOPS_ID;
                        connection.execute(
                            query, {}, { outFormat: oracledb.OBJECT},
                            function (err, result) {
                                if (err) {
                                    console.error(err);
                                    doRelease(connection);
                                }
                                doRelease(connection);
                                ress.rows.push(result.rows);
                                cb(ress.rows);
                            });
                    }else{
                        doRelease(connection);
                        cb(ress.rows);
                    }
                });
        });
}

function getLocation(cb) {
    oracledb.getConnection(
        {
            user: "tops",
            password: "tops",
            connectString: "(DESCRIPTION =(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = webdb.terracorp.ru)(PORT = 1521)))(CONNECT_DATA = (SID = WEBDB)(SERVER = DEDICATED)))"
        },
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            var query = "SELECT * FROM top_locations";
            connection.execute(
                query, {}, { outFormat: oracledb.OBJECT},
                function (err, result) {
                    if (err) {
                        console.error(err);
                        doRelease(connection);
                        cb(err);
                    }
                    doRelease(connection);
                    cb(result.rows);
                });
        });
}


function saveItems(req, col, cb){
    oracledb.getConnection(
        {
            user: "tops",
            password: "tops",
            connectString: "(DESCRIPTION =(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = webdb.terracorp.ru)(PORT = 1521)))(CONNECT_DATA = (SID = WEBDB)(SERVER = DEDICATED)))"
        },
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            req = JSON.parse(req);
            col = JSON.parse(col);
                //var query = "INSERT INTO items (itemname, item_types_id, itemheight, itemwidth, itemthin, itemprice) VALUES (:itemname, :item_types_id, :itemheight, :itemwidth, :itemthin, :itemprice)";
                var query = [];
                query.push("INSERT ALL ");
                req.forEach(function(item, i){
                    query.push("INTO items (ITEMNAME, ITEM_TYPES_ID, ITEMHEIGHT, ITEMWIDTH, ITEMTHIN, ITEMPRICE) VALUES");
                    query.push("(");
                    for(var i = 0; i < item.length; i ++){
                        if(i === 0){
                            query.push("'"+item[i]+"'");
                            query.push(",");
                        }else{
                            query.push(+item[i]);
                            console.log(typeof +item[i]);
                            query.push(",");
                        }
                    }
                    delete query[query.length-1];
                    query.push(")");
                });
                query.push('SELECT 1 FROM DUAL');
                query = query.join(' ');
                connection.execute(
                    query, {}, {autoCommit: true},
                    function (err, result) {
                        if (err) {
                            console.log(err);
                            doRelease(connection);
                            cb(err);
                        }
                        console.log(result);
                        doRelease(connection);
                        cb(result);
                    });
        });
}


function updateItems(req, id, col, cb){
    oracledb.getConnection(
        {
            user: "tops",
            password: "tops",
            connectString: "(DESCRIPTION =(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = webdb.terracorp.ru)(PORT = 1521)))(CONNECT_DATA = (SID = WEBDB)(SERVER = DEDICATED)))"
        },
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            req = JSON.parse(req);
            console.log(req, id,col);
            var query = [];
            query.push("UPDATE " + col);
            query.push("SET ");
            query.push("itemname = :itemname,");
            query.push("item_types_id = :itemTypesId,");
            query.push("itemheight = :itemheight,");
            query.push("itemwidth = :itemwidth,");
            query.push("itemthin = :itemthin,");
            query.push("itemprice = :itemprice");
            query.push(" WHERE itemid= :id");
            query = query.join(' ');
            console.log(query);
            connection.execute(
                query, {
                    id: id,
                    itemname: req[0],
                    itemTypesId:  +req[1],
                    itemheight:  +req[2],
                    itemwidth:  +req[3],
                    itemthin:  +req[4],
                    itemprice: +req[5]
                }, {autoCommit: true},
                function (err, result) {
                    if (err) {
                        console.log(err);
                        doRelease(connection);
                        cb(err);
                    }
                    console.log(result);
                    doRelease(connection);
                    cb(result);
                });
        });
}


//начало обновления параметров работы
function updateJobParams(req, id, col, cb){
    oracledb.getConnection(
        {
            user: "tops",
            password: "tops",
            connectString: "(DESCRIPTION =(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = webdb.terracorp.ru)(PORT = 1521)))(CONNECT_DATA = (SID = WEBDB)(SERVER = DEDICATED)))"
        },
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            req = JSON.parse(req);
            console.log(req, id,col);
            var query = [];
            query.push("UPDATE " + col);
            query.push("SET ");
            query.push("jobdesc = :jobdesc,");
            query.push("jobprice = :jobprice,");
            query.push("jobuoms_id = :jobuomsId");
            query.push(" WHERE jobid= :jobid");
            query = query.join(' ');
            console.log(query);
            connection.execute(
                query, {
                    jobid: id,
                    jobdesc: req[0],
                    jobprice:  +req[1],
                    jobuomsId:  +req[2]
                }, {autoCommit: true},
                function (err, result) {
                    if (err) {
                        console.log(err);
                        doRelease(connection);
                        cb(err);
                    }
                    console.log(result);
                    doRelease(connection);
                    cb(result);
                });
        });
}

//конец обновления параметров работы

//начало обновления спецификации
function updateBomParams(req, id, col, cb){
    oracledb.getConnection(
        {
            user: "tops",
            password: "tops",
            connectString: "(DESCRIPTION =(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = webdb.terracorp.ru)(PORT = 1521)))(CONNECT_DATA = (SID = WEBDB)(SERVER = DEDICATED)))"
        },
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            req = JSON.parse(req);
            console.log(req, id,col);
            var query = [];
            query.push("UPDATE " + col);
            query.push("SET ");
            query.push("itemid = :itemid,");
            query.push("bomtype = :bomtype,");
            query.push("itemconsumpqty = :itemconsumpqty,");
            query.push("consumpuoms_id = :consumpuoms_id,");
            query.push("itemconsumperqty = :itemconsumperqty,");
            query.push("consumpperuoms_id = :consumpperuoms_id");
            query.push(" WHERE bomid= :bomid");
            query = query.join(' ');
            console.log(query);
            connection.execute(
                query, {
                    bomid: id,
                    itemid: req[0],
                    bomtype:  +req[1],
                    itemconsumpqty:  +req[2],
                    consumpuoms_id:  +req[3],
                    itemconsumperqty:  +req[4],
                    consumpperuoms_id:  +req[5]
                }, {autoCommit: true},
                function (err, result) {
                    if (err) {
                        console.log(err);
                        doRelease(connection);
                        cb(err);
                    }
                    console.log(result);
                    doRelease(connection);
                    cb(result);
                });
        });
}

//конец обновления спецификации

//Сохранение в таблицу jobparams
function saveJobParams(req, col, cb){
    oracledb.getConnection(
        {
            user: "tops",
            password: "tops",
            connectString: "(DESCRIPTION =(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = webdb.terracorp.ru)(PORT = 1521)))(CONNECT_DATA = (SID = WEBDB)(SERVER = DEDICATED)))"
        },
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            req = JSON.parse(req);
            col = JSON.parse(col);
            //var query = "INSERT INTO items (itemname, item_types_id, itemheight, itemwidth, itemthin, itemprice) VALUES (:itemname, :item_types_id, :itemheight, :itemwidth, :itemthin, :itemprice)";
            var query = [];
            query.push("INSERT ALL ");
            req.forEach(function(item, i){
                query.push("INTO jobparams (jobdesc, jobprice, jobuoms_id) VALUES");
                query.push("(");
                for(var i = 0; i < item.length; i ++){
                    if(i === 0){
                        query.push("'"+item[i]+"'");
                        query.push(",");
                    }else{
                        query.push(+item[i]);
                        query.push(",");
                    }
                }
                delete query[query.length-1];
                query.push(")");
            });
            query.push('SELECT 1 FROM DUAL');
            query = query.join(' ');
            connection.execute(
                query, {}, {autoCommit: true},
                function (err, result) {
                    if (err) {
                        console.log(err);
                        doRelease(connection);
                        cb(err);
                    }
                    console.log(result);
                    doRelease(connection);
                    cb(result);
                });
        });
}


//Сохранение в таблицу bomparams
function saveBomParams(req, col, cb){
    oracledb.getConnection(
        {
            user: "tops",
            password: "tops",
            connectString: "(DESCRIPTION =(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = webdb.terracorp.ru)(PORT = 1521)))(CONNECT_DATA = (SID = WEBDB)(SERVER = DEDICATED)))"
        },
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            req = JSON.parse(req);
            col = JSON.parse(col);
            //var query = "INSERT INTO items (itemname, item_types_id, itemheight, itemwidth, itemthin, itemprice) VALUES (:itemname, :item_types_id, :itemheight, :itemwidth, :itemthin, :itemprice)";
            var query = [];
            query.push("INSERT ALL ");
            req.forEach(function(item, i){
                query.push("INTO bomparams (itemid, bomtype, ItemConsumpQty, consumpuoms_id, ItemConsumperQty, consumpperuoms_id) VALUES");
                query.push("(");
                for(var i = 0; i < item.length; i ++){
                    if(i === 0){
                        query.push("'"+item[i]+"'");
                        query.push(",");
                    }else{
                        query.push(+item[i]);
                        query.push(",");
                    }
                }
                delete query[query.length-1];
                query.push(")");
            });
            query.push('SELECT 1 FROM DUAL');
            query = query.join(' ');
            connection.execute(
                query, {}, {autoCommit: true},
                function (err, result) {
                    if (err) {
                        console.log(err);
                        doRelease(connection);
                        cb(err);
                    }
                    console.log(result);
                    doRelease(connection);
                    cb(result);
                });
        });
}


//Сохранение в таблицу Uom
function saveUom(req, col, cb){
    oracledb.getConnection(
        {
            user: "tops",
            password: "tops",
            connectString: "(DESCRIPTION =(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = webdb.terracorp.ru)(PORT = 1521)))(CONNECT_DATA = (SID = WEBDB)(SERVER = DEDICATED)))"
        },
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            req = JSON.parse(req);
            col = JSON.parse(col);
            //var query = "INSERT INTO items (itemname, item_types_id, itemheight, itemwidth, itemthin, itemprice) VALUES (:itemname, :item_types_id, :itemheight, :itemwidth, :itemthin, :itemprice)";
            var query = [];
            query.push("INSERT ALL ");
            req.forEach(function(item, i){
                query.push("INTO uom (uom) VALUES");
                query.push("(");
                for(var i = 0; i < item.length; i ++){
                    if(i === 0){
                        query.push("'"+item[i]+"'");
                        query.push(",");
                    }else{
                        query.push(+item[i]);
                        query.push(",");
                    }
                }
                delete query[query.length-1];
                query.push(")");
            });
            query.push('SELECT 1 FROM DUAL');
            query = query.join(' ');
            connection.execute(
                query, {}, {autoCommit: true},
                function (err, result) {
                    if (err) {
                        console.log(err);
                        doRelease(connection);
                        cb(err);
                    }
                    console.log(result);
                    doRelease(connection);
                    cb(result);
                });
        });
}

//Сохранение в таблицу Users
function saveUsers(req, col, cb){
    oracledb.getConnection(
        {
            user: "tops",
            password: "tops",
            connectString: "(DESCRIPTION =(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = webdb.terracorp.ru)(PORT = 1521)))(CONNECT_DATA = (SID = WEBDB)(SERVER = DEDICATED)))"
        },
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            req = JSON.parse(req);
            col = JSON.parse(col);
            var query = [];
            query.push("INSERT ALL ");
            req.forEach(function(item, i){
                item[0] = +item[0];
                item[1] = +item[1];
                item[2] = "'" + item[2]+"'";
                item[3] = "'" + bcrypt.encrypt(item[3])+"'";
                item[4] = "'" + item[4]+"'";
                query.push("INTO top_users (top_location_id, top_user_level, top_user, top_user_password, top_user_fio) VALUES");
                query.push("(");
                for(var i = 0; i < item.length; i ++){
                    query.push(item[i]);
                    query.push(",");
                }
                delete query[query.length-1];
                query.push(")");
            });
            query.push('SELECT 1 FROM DUAL');
            query = query.join(' ');
            console.log(query);
            connection.execute(
                query, {}, {autoCommit: true},
                function (err, result) {
                    if (err) {
                        console.log(err);
                        doRelease(connection);
                        cb(err);
                    }
                    console.log(result);
                    doRelease(connection);
                    cb(result);
                });
        });
}

module.exports.draw = function(req, res){
    oracledb.getConnection(
        {
            user: "tops",
            password: "tops",
            connectString: "(DESCRIPTION =(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = webdb.terracorp.ru)(PORT = 1521)))(CONNECT_DATA = (SID = WEBDB)(SERVER = DEDICATED)))"
        },
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            console.log(req.body);
            var query = "SELECT * FROM countertops_addon WHERE countertops_id="+req.body.id;
            connection.execute(
                query, {}, { outFormat: oracledb.OBJECT},
                function (err, result) {
                    if (err) {
                        console.error(err);
                        doRelease(connection);
                    }
                    doRelease(connection);
                    res.json(result.rows);
                });
        });
};


//Получение данных из таблицы ITEMS
function getItems(cb){
    oracledb.getConnection(
        {
            user: "tops",
            password: "tops",
            connectString: "(DESCRIPTION =(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = webdb.terracorp.ru)(PORT = 1521)))(CONNECT_DATA = (SID = WEBDB)(SERVER = DEDICATED)))"
        },
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            var query = "SELECT * FROM items";
            connection.execute(
                query, {}, { outFormat: oracledb.OBJECT},
                function (err, result) {
                    if (err) {
                        console.error(err);
                        doRelease(connection);
                        cb(err);
                    }
                    doRelease(connection);
                    cb(result.rows);
                });
        });
}


//получение всей таблицы jobpparams
function getJobParams(cb){
    oracledb.getConnection(
        {
            user: "tops",
            password: "tops",
            connectString: "(DESCRIPTION =(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = webdb.terracorp.ru)(PORT = 1521)))(CONNECT_DATA = (SID = WEBDB)(SERVER = DEDICATED)))"
        },
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            var query = "SELECT * FROM jobparams";
            connection.execute(
                query, {}, { outFormat: oracledb.OBJECT},
                function (err, result) {
                    if (err) {
                        console.error(err);
                        doRelease(connection);
                        cb(err);
                    }
                    doRelease(connection);
                    cb(result.rows);
                });
        });
}


//получение всей таблицы UOM
function getUoms(cb){
    oracledb.getConnection(
        {
            user: "tops",
            password: "tops",
            connectString: "(DESCRIPTION =(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = webdb.terracorp.ru)(PORT = 1521)))(CONNECT_DATA = (SID = WEBDB)(SERVER = DEDICATED)))"
        },
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            var query = "SELECT * FROM uom";
            connection.execute(
                query, {}, { outFormat: oracledb.OBJECT},
                function (err, result) {
                    if (err) {
                        console.error(err);
                        doRelease(connection);
                        cb(err);
                    }
                    doRelease(connection);
                    cb(result.rows);
                });
        });
}

//получение всей таблицы TOP_USERS
function getUsers(cb){
    oracledb.getConnection(
        {
            user: "tops",
            password: "tops",
            connectString: "(DESCRIPTION =(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = webdb.terracorp.ru)(PORT = 1521)))(CONNECT_DATA = (SID = WEBDB)(SERVER = DEDICATED)))"
        },
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            var query = "SELECT * FROM top_users WHERE top_user_id > 2";
            connection.execute(
                query, {}, { outFormat: oracledb.OBJECT},
                function (err, result) {
                    if (err) {
                        console.error(err);
                        doRelease(connection);
                        cb(err);
                    }
                    doRelease(connection);
                    cb(result.rows);
                });
        });
}

//получение данных из таблицы itemtypes
function getItemType(cb){
    oracledb.getConnection(
        {
            user: "tops",
            password: "tops",
            connectString: "(DESCRIPTION =(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = webdb.terracorp.ru)(PORT = 1521)))(CONNECT_DATA = (SID = WEBDB)(SERVER = DEDICATED)))"
        },
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            var query = "SELECT * FROM itemtypes";
            connection.execute(
                query, {}, { outFormat: oracledb.OBJECT},
                function (err, result) {
                    if (err) {
                        console.error(err);
                        doRelease(connection);
                        cb(err);
                    }
                    doRelease(connection);
                    cb(result.rows);
                });
        });
}

//получение всей таблицы jobpparams
function getBomParams(cb){
    oracledb.getConnection(
        {
            user: "tops",
            password: "tops",
            connectString: "(DESCRIPTION =(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = webdb.terracorp.ru)(PORT = 1521)))(CONNECT_DATA = (SID = WEBDB)(SERVER = DEDICATED)))"
        },
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            var query = "SELECT * FROM bomparams";
            connection.execute(
                query, {}, { outFormat: oracledb.OBJECT},
                function (err, result) {
                    if (err) {
                        console.error(err);
                        doRelease(connection);
                        cb(err);
                    }
                    doRelease(connection);
                    cb(result.rows);
                });
        });
}


//получение данных из таблицы UOM
function getJobuom(cb){
    oracledb.getConnection(
        {
            user: "tops",
            password: "tops",
            connectString: "(DESCRIPTION =(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = webdb.terracorp.ru)(PORT = 1521)))(CONNECT_DATA = (SID = WEBDB)(SERVER = DEDICATED)))"
        },
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            var query = "SELECT * FROM uom";
            connection.execute(
                query, {}, { outFormat: oracledb.OBJECT},
                function (err, result) {
                    if (err) {
                        console.error(err);
                        doRelease(connection);
                        cb(err);
                    }
                    doRelease(connection);
                    cb(result.rows);
                });
        });
}

function delItems(id, table, nameId, cb){
    oracledb.getConnection(
        {
            user: "tops",
            password: "tops",
            connectString: "(DESCRIPTION =(ADDRESS_LIST = (ADDRESS = (PROTOCOL = TCP)(HOST = webdb.terracorp.ru)(PORT = 1521)))(CONNECT_DATA = (SID = WEBDB)(SERVER = DEDICATED)))"
        },
        function (err, connection) {
            if (err) {
                console.error(err.message);
                return;
            }
            var query = "DELETE FROM "+table+" WHERE "+nameId+"="+ Number(id);
            console.log(query);
            connection.execute(
                query, {}, {autoCommit: true},
                function (err, result) {
                    if (err) {
                        console.error(err);
                        doRelease(connection);
                        cb(err);
                    }
                    doRelease(connection);
                    console.log(result);
                    cb(result);
                });
        });
}


function doRelease(connection)
{
    connection.close(
        function(err) {
            if (err)
                console.error(err.message);
        });
}