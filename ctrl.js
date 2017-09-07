var oracledb = require('oracledb');
var async    = require('async');
var flash = require('connect-flash');

module.exports.main = function(req, res, next) {
    getData(function(data){
        res.render('index', { title: 'Express', data: data});
    });
};

module.exports.login = function(req, res, next) {
    res.render('login', { title: 'Авторизация', message: req.flash('message') });
};
module.exports.auth = function(req, res, next) {
    if(req.body.username === 'admin' && req.body.password === 'admin'){
        res.redirect('admin');
    }else if(req.body.username !== 'admin'){
        res.render('login', { title: 'Авторизация', message: 'Пользователь '+req.body.username+' не найден!'});
    }else{
        res.render('login', { title: 'Авторизация', message: 'Пароль введен не верно!'});
    }
};

module.exports.mainAdmin = function(req, res, next){
    res.render('admin', { title: 'Административная панель'});
};

module.exports.items = function(req, res, next){
    getItems(function(items){
        res.render('items', { title: 'Параметры материала', items: items});
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

module.exports.jobuom = function(req, res, next){
    getJobuom(function(data){
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
                    var query = "INSERT INTO contertops (width, heigth, section, joint_vertical, joint_horizontal, section_side, section_height, bottom_glue_width) VALUES (:width, :heigth, :section, :joint_vertical, :joint_horizontal, :section_side, :section_height, :bottom_glue_width)";
                    connection.execute(
                        query, [req.body.width, req.body.heigth, req.body.section, req.body.joinVertical, req.body.joinHorizontal, req.body.sectionSide, req.body.sectionHeight, req.body.bottomGlueWidth], {autoCommit: true},
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
                    var query = "SELECT MAX(countertops_id) as maxid FROM contertops";
                    connection.execute(
                        query, {}, {outFormat: oracledb.OBJECT},
                        function (err, result) {
                            if (err) {
                                doRelease(connection);
                                cb(err);
                            }
                            doRelease(connection);
                            cb(null, result.rows[0].MAXID);
                        });
                })
        },
        function paramsSanteh(maxid, cb ) {
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
                    var query = "INSERT INTO countertops_addon (addon_type_id, countertops_id, addon_x, addon_y, addon_a, addon_b, bottom_mount) VALUES (:addon_type_id, :countertops_id, :addon_x, :addon_y, :addon_a, :addon_b, :bottom_mount)";
                    connection.execute(
                        query, [req.body.moiForm, maxid, req.body.coordinatesX, req.body.coordinatesY, (req.body.diameter || req.body.sideA || req.body.lots), (req.body.sideB || req.body.sal), req.body.bottomMounting], {autoCommit: true},
                        function (err, result) {
                            if (err) {
                                console.log(err);
                                doRelease(connection);
                                cb(err);
                            }
                            doRelease(connection);
                            cb(null, maxid);
                        });
                })
        },
        function saveDop(maxid, cb ) {
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
                        var query = "INSERT INTO countertops_addon (addon_type_id, countertops_id, addon_x, addon_y, addon_a) VALUES (:addon_type_id, :countertops_id, :addon_x, :addon_y, :addon_a)";
                        console.log(query);
                        connection.execute(
                            query, [9999, maxid, item.inputX, item.inputY, item.inputD], {autoCommit: true},
                            function (err, result) {
                                if (err) {
                                    console.log(err);
                                    doRelease(connection);
                                    cb(err);
                                }
                                console.log(result);
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
            console.log('Данные не записаны в CONTERTOPS!' + err);
            res.json(err);
        }
        console.log('Данные успешно записаны в CONTERTOPS!');
        res.json('Данные успешно записаны в CONTERTOPS!');
    });
};

function getData(cb) {
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
            var query = "SELECT * FROM contertops";
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