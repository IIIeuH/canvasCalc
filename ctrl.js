var oracledb = require('oracledb');
var async    = require('async');

module.exports.main = function(req, res, next) {
    getData(function(data){
        res.render('index', { title: 'Express', data: data});
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


function doRelease(connection)
{
    connection.close(
        function(err) {
            if (err)
                console.error(err.message);
        });
}