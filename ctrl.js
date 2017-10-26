var oracledb = require('oracledb');
var async    = require('async');
var flash = require('connect-flash');
var passport    = require('./passport');
var bcrypt          = require('./crypto');
var mailer = require('nodemailer');
var csv=require('csvtojson');

var transporter = mailer.createTransport({
    service: 'yandex.ru',
    auth: {
        user: 'terra.notification@yandex.ru',
        pass: 'W4QFdLVWlHtd'
    }
});

module.exports.main = function(req, res, next) {
    res.cookie('user', req.user[0].TOP_USER_ID);
    getData(req, function(data){
        res.render('index', { title: 'Express', data: data, user: req.user[0]});
    });
};

module.exports.mainRes = function(req, res, next) {
    res.render('resAdmin', { title: 'Express'});
};

module.exports.mainResAjax = function(req, res, next) {
    getDataRadyAdmin(req, function (data) {
        res.json(data);
    })
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

module.exports.topLocations = function(req, res, next){
    topLocations(function(location){
        res.render('topLocation', { title: 'Местоположение', items: location});
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

module.exports.addItemsCSV = function(req, res, next){
    saveItemsCSV(req.body.data, req.body.col,  function(data){
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

module.exports.addTopLocations = function(req, res, next){
    addTopLocations(req.body.data, req.body.col,  function(data){
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

module.exports.getUsers = function(req, res, next){
    getUsers(function(data){
        res.json(data);
    });
};

module.exports.jobParams = function(req, res, next){
    getJobParams(function(jobParams){
        res.render('jobparams', { title: 'Параметры работ', jobParams: jobParams});
    });
};

module.exports.saveItems = function(req, res, next){
    getCounterTops(function(items){
        res.render('saveItems', { title: 'Параметры работ', items: items});
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

module.exports.updateUom = function(req, res, next) {
    updateUom(req.body.data, req.body.id, 'uom', function (data) {
        res.json(data);
    })
};

module.exports.updateUsers = function(req, res, next) {
    updateUsers(req.body.data, req.body.id, 'top_users', function (data) {
        res.json(data);
    })
};

module.exports.updateTopLocation = function(req, res, next) {
    updateTopLocation(req.body.data, req.body.id, 'top_locations', function (data) {
        res.json(data);
    })
};

module.exports.upload = function(req, res, next) {
    console.log(req.files);
    csvFilePath=req.files.csv.path;
    console.log(csvFilePath);
    function ItemReady(axaptaItemId, name, thin, price, width, height){
        this.ITEM_AX_ID = axaptaItemId;
        this.ITEMNAME = name;
        this.ITEMTHIN = thin;
        this.ITEM_TYPES_ID = 1;
        this.ITEMPRICE = price;
        this.ITEMHEIGHT = width;
        this.ITEMWIDTH = height;
    }
    var masReady = [];
    var string = '';
    csv()
    .fromFile(csvFilePath)
    .on('json', function(jsonObj){
        console.log(jsonObj.itemid);
        string += "'"+jsonObj.itemid + "',";
    })
    .on('done',function(error) {
        if (error) console.log(error);
        string = string.substring(0, string.length - 1);
        console.log(string);
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
                var queryTran = "truncate table items_temp";
                connection.execute(
                    queryTran, {}, {outFormat: oracledb.OBJECT},
                    function (err, ress) {
                        if (err) {
                            console.error(err);
                            doRelease(connection);
                        }
                        doRelease(connection);

                    });
            });
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
                var query = "insert INTO items_temp (ITEM_AX_ID, ITEMNAME, ITEMTHIN, ITEMPRICE, ITEM_TYPES_ID, ITEMHEIGHT, ITEMWIDTH) select pr.itemrelation, i_tab.itemname, case when ( REGEXP_SUBSTR(i_tab.ItemThicknessId, '(([0-9]+.{1}[0-9]+)|[0-9]+)', 1, 1) is null) then 0 else to_number( REGEXP_SUBSTR(i_tab.ItemThicknessId, '(([0-9]+.{1}[0-9]+)|[0-9]+)', 1, 1), '9999.9999' ) end AS itemthicknessId, case when (t_exr.Currencycode != 'RUR' ) then (pr.Amount * t_exr.exchrate /100) else pr.Amount end as AmountMST, 1, k_size.Length_r as Length, k_size.wight_r as wight from pricedisctable@ax.terracorp.ru pr join (select sum_exr.exchrate, dt_exr.FROMDATE, sum_exr.todate, dt_exr.Currencycode, dt_exr.Dataareaid from (select max(FROMDATE) AS FROMDATE , Exr.Currencycode, Exr.Dataareaid from ExchRates@Ax.terracorp.ru Exr group by Exr.Currencycode, Exr.Dataareaid ) dt_exr join ExchRates@ax.terracorp.ru sum_exr on SUBSTR(NLS_LOWER(sum_exr.DATAAREAID),1,3) = SUBSTR(NLS_LOWER(dt_exr.DATAAREAID),1,3) and sum_exr.fromdate = dt_exr.FROMDATE and SUBSTR(NLS_LOWER(sum_exr.CURRENCYCODE),1,3) = SUBSTR(NLS_LOWER(dt_exr.CURRENCYCODE),1,3) ) t_exr on t_exr.dataareaid = pr.dataareaid and t_exr.Currencycode = pr.currency join inventtable@ax.terracorp.ru i_tab on SUBSTR(NLS_LOWER(i_tab.DATAAREAID),1,3) = SUBSTR(NLS_LOWER(pr.DATAAREAID),1,3) and SUBSTR(NLS_LOWER(i_tab.ITEMID),1,20) = SUBSTR(NLS_LOWER(pr.itemrelation),1,20) join k_ItemSize@ax.terracorp.ru k_size on SUBSTR(NLS_LOWER(i_tab.K_ITEMSIZEID),1,20) = SUBSTR(NLS_LOWER(k_size.K_ITEMSIZEID),1,20) where pr.relation = 4 and accountrelation = 'РОЗН' and pr.dataareaid = 'rel' and pr.itemrelation in ("+string+")";
                connection.execute(
                    query, {}, { outFormat: oracledb.OBJECT},
                    function (err, data) {
                        if (err) {
                            console.error(err);
                            doRelease(connection);
                        }
                        var querySelect = "SELECT * FROM items_temp";
                        connection.execute(
                            querySelect, {}, {outFormat: oracledb.OBJECT},
                            function (err, result) {
                                if (err) {
                                    console.error(err);
                                    doRelease(connection);
                                }
                                result.rows.forEach(function (item) {
                                    var obj = {};
                                    console.log(item);
                                    obj = new ItemReady(item.ITEM_AX_ID, item.ITEMNAME, item.ITEMTHIN, item.ITEMPRICE, item.ITEMWIDTH*10, item.ITEMHEIGHT*10);
                                    masReady.push(obj);
                                });
                                res.json(masReady);
                                doRelease(connection);
                            });
                    });

            });
    })
};

module.exports.mail = function(req, res, next) {
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
            var query = "SELECT * FROM top_users WHERE top_user_id = " + req.query.id;
            connection.execute(
                query, {}, { outFormat: oracledb.OBJECT},
                function (err, ress) {
                    if (err) {
                        console.error(err);
                        doRelease(connection);
                    }
                        doRelease(connection);
                        console.log(ress.rows[0].TOP_USER_EMAIL);
                        transporter.sendMail({
                            from: '<terra.notification@yandex.ru>',
                            to: ress.rows[0].TOP_USER_EMAIL,
                            subject: 'Пароль от калькулятора',
                            text: 'Ваш пароль ' + bcrypt.decrypt(ress.rows[0].TOP_USER_PASSWORD),
                            html: '<p>Ваш пароль ' + bcrypt.decrypt(ress.rows[0].TOP_USER_PASSWORD)+'</p>'
                        }, function(err, data){
                            if(err) console.log(err);
                            res.json(ress.rows[0]);
                        });

                });
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
                    var itemid = +req.body.itemId;
                    console.log(req.body);
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
                        var query = "SELECT * FROM contertops WHERE countertops_id = " + req.body.counterTopId;
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
                    console.log('COUNTEMDDS', counterTopId, req.body.dop);
                    req.body.dop = JSON.parse(req.body.dop);
                    if(req.body.dop.length > 0){
                        async.forEachOf(res, function(item, k, done){
                            var query = "merge into countertops_addon a using (select :COUNTERTOPS_ADDON_ID COUNTERTOPS_ADDON_ID,:ADDON_TYPE_ID ADDON_TYPE_ID, :COUNTERTOPS_ID COUNTERTOPS_ID, :ADDON_X ADDON_X, :ADDON_Y ADDON_Y, :ADDON_A ADDON_A, :ADDON_B ADDON_B, :BOTTOM_MOUNT BOTTOM_MOUNT from dual) b on (a.COUNTERTOPS_ADDON_ID=b.COUNTERTOPS_ADDON_ID and a.COUNTERTOPS_ID=b.COUNTERTOPS_ID and b.COUNTERTOPS_ID!=0) when matched then update set a.ADDON_TYPE_ID=b.ADDON_TYPE_ID, a.ADDON_X=b.ADDON_X, a.ADDON_Y=b.ADDON_Y, a.ADDON_A=b.ADDON_A, a.ADDON_B=b.ADDON_B, a.BOTTOM_MOUNT=b.BOTTOM_MOUNT when not matched then insert (ADDON_TYPE_ID, COUNTERTOPS_ID, ADDON_X, ADDON_Y, ADDON_A, ADDON_B, BOTTOM_MOUNT) values (b.ADDON_TYPE_ID, b.COUNTERTOPS_ID, b.ADDON_X, b.ADDON_Y, b.ADDON_A, b.ADDON_B, b.BOTTOM_MOUNT)";
                            connection.execute(
                                query, [item.dopId || null, 9999, counterTopId, item.inputX || null, item.inputY || null, item.inputD || null, null, null], {autoCommit: true},
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
                    }else{
                        var query = "DELETE FROM countertops_addon WHERE countertops_id = " + counterTopId + " AND addon_type_id = 9999";
                        console.log(query);
                        connection.execute(
                            query,
                            function (err) {
                                if (err) {
                                    console.log(err);
                                    doRelease(connection);
                                    cb(err);
                                }
                                doRelease(connection);
                                cb();
                            });
                    }
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

function getDataRadyAdmin(req, cb) {
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
            var query = "SELECT * FROM contertops  WHERE countertops_id =" + req.body.id;
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

function getUsers(cb) {
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
            var query = "SELECT * FROM top_users";
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
                    query.push("INTO items (ITEM_AX_ID, ITEMNAME, ITEM_TYPES_ID, ITEMHEIGHT, ITEMWIDTH, ITEMTHIN, ITEMPRICE) VALUES");
                    query.push("(");
                    for(var i = 0; i < item.length; i ++){
                        if(i === 0 || i === 1){
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

function saveItemsCSV(req, col, cb){
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
            var queryS = "truncate table items_temp";
            connection.execute(
                queryS, {}, {autoCommit: true},
                function (err, result) {
                    if (err) {
                        console.log(err);
                        doRelease(connection);
                        cb(err);
                    }
                    var query = [];
                    query.push("INSERT ALL ");
                    req.forEach(function(item){
                        query.push("INTO items_temp (ITEM_AX_ID, ITEMNAME, ITEM_TYPES_ID, ITEMTHIN, ITEMWIDTH, ITEMHEIGHT, ITEMPRICE) VALUES");
                        query.push("(");
                        for(var i = 0; i < item.length; i ++){
                            if(i === 0 || i === 1){
                                item[i] = item[i].replace(/'/g, "''");
                                console.log(item[i]);
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
                            var queryMarge = "merge into items a using (select * from items_temp) b on (a.item_ax_id=b.item_ax_id) when matched then update set a.ITEMNAME=b.ITEMNAME, a.ITEMHEIGHT=b.ITEMHEIGHT, a.ITEMWIDTH=b.ITEMWIDTH, a.ITEMTHIN=b.ITEMTHIN, a.ITEMPRICE=b.ITEMPRICE, a.ITEM_TYPES_ID=b.ITEM_TYPES_ID when not matched then insert (ITEM_AX_ID, ITEMNAME, ITEM_TYPES_ID, ITEMHEIGHT, ITEMWIDTH, ITEMTHIN, ITEMPRICE) values (b.ITEM_AX_ID, b.ITEMNAME, b.ITEM_TYPES_ID, b.ITEMHEIGHT, b.ITEMWIDTH, b.ITEMTHIN, b.ITEMPRICE)";
                            connection.execute(
                                queryMarge, {}, {autoCommit: true},
                                function (err, result) {
                                    if (err) {
                                        console.log(err);
                                        doRelease(connection);
                                        cb(err);
                                    } else {
                                        doRelease(connection);
                                        cb(result);
                                    }
                                });
                        });
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
            console.log('REQ' + req);
            var query = [];
            query.push("UPDATE " + col);
            query.push("SET ");
            query.push("item_ax_id = :item_ax_id,");
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
                    item_ax_id: req[0],
                    itemname: req[1],
                    itemTypesId:  +req[2],
                    itemheight:  +req[3],
                    itemwidth:  +req[4],
                    itemthin:  +req[5],
                    itemprice: +req[6]
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

//начало обновления Uom
function updateUom(req, id, col, cb){
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
            console.log(req[0],req, id,col);
            var query = [];
            query.push("UPDATE " + col);
            query.push("SET");
            query.push("uom = :uom");
            query.push("WHERE uoms_id= :uoms_id");
            query = query.join(' ');
            console.log(query);
            connection.execute(
                query, {
                    uoms_id: id,
                    uom: req[0]
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

//конец обновления Uom


//начало обновления Users
function updateUsers(req, id, col, cb){
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
            console.log(req[0],req, id,col);
            var query = [];
            query.push("UPDATE " + col);
            query.push("SET");
            query.push("top_location_id = :top_location_id,");
            query.push("top_user_level = :top_user_level,");
            query.push("top_user = :top_user,");
            query.push("top_user_fio = :top_user_fio,");
            query.push("top_user_address = :top_user_address,");
            query.push("top_user_phone = :top_user_phone,");
            query.push("top_user_email = :top_user_email");
            query.push("WHERE top_user_id= :top_user_id");
            query = query.join(' ');
            connection.execute(
                query, {
                    top_user_id: id,
                    top_location_id: req[0],
                    top_user_level: req[1],
                    top_user: req[2],
                    top_user_fio: req[3],
                    top_user_address: req[4],
                    top_user_phone: req[5],
                    top_user_email: req[6]
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

//конец обновления Users


//начало обновления Top_locations
function updateTopLocation(req, id, col, cb){
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
            console.log(req[0],req, id,col);
            var query = [];
            query.push("UPDATE " + col);
            query.push("SET");
            query.push("top_location_name = :top_location_name");
            query.push("WHERE top_location_id= :top_location_id");
            query = query.join(' ');
            connection.execute(
                query, {
                    top_location_id: id,
                    top_location_name: req[0]
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

//конец обновления Top_locations


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
                item[5] = "'" + item[5]+"'";
                item[6] = "'" + item[6]+"'";
                item[7] = "'" + item[7]+"'";
                query.push("INTO top_users (top_location_id, top_user_level, top_user, top_user_password, top_user_fio, top_user_address, top_user_phone, top_user_email) VALUES");
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

//Сохранение в таблицу TOP_LOCATIONS
function addTopLocations(req, col, cb){
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
            console.log(req);
            query.push("INSERT ALL ");
            req.forEach(function(item, i){
                query.push("INTO top_locations (top_location_name) VALUES");
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


//Получение данных из таблицы COUNTERTOPS
function getCounterTops(cb){
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

//получение всей таблицы TOP_LOCATIONS
function topLocations(cb){
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