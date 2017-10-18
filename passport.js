var passport       = require('passport');
var LocalStrategy  = require('passport-local').Strategy;
var oracledb = require('oracledb');
var bcrypt          = require('./crypto');


passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(id, done) {
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
            var query = "SELECT * FROM top_users where top_user_id =" + id.TOP_USER_ID;
            connection.execute(
                query, {}, {outFormat: oracledb.OBJECT},
                function (err, result) {
                    if (err) {
                        doRelease(connection);
                        return done(err);
                    }
                    doRelease(connection);
                    done(null, result.rows)
                });
        });
});

passport.use('local',new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback : true
},
function(req, username, password, done) {
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
            var query = "SELECT * FROM top_users WHERE top_user = '" +username + "'";
            connection.execute(
                query, {}, {outFormat: oracledb.OBJECT},
                function (err, result) {
                    if (err) {
                        doRelease(connection);
                        cb(err);
                    }
                    doRelease(connection);
                    if (!result.rows.length) {
                        return done(null, false, req.flash('message','Пользователь '+username+' не найден!'));
                    }
                    if(password == bcrypt.decrypt(result.rows[0].TOP_USER_PASSWORD)){
                    //if( bcrypt.decrypt(password, result.rows[0].TOP_USER_PASSWORD)){
                        return done(null, result.rows[0]);
                    }else{
                        return done(null, false, req.flash('message','Пароль введен не верно!'));
                    }
                });
        })
}
));

passport.use('local-reg',new LocalStrategy({
        usernameField: 'username',
        passwordField: 'pwd1',
        passReqToCallback : true
    },
    function(req, username, pwd1, done) {
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

                var query = "SELECT * FROM top_users where top_user = '" + req.body.username+ "'";
                connection.execute(
                    query, {}, {outFormat: oracledb.OBJECT},
                    function (err, result) {
                        if (err) {
                            doRelease(connection);
                            return done(err);
                        }
                        doRelease(connection);
                        if(result.rows.length){
                            return done(null, false, req.flash('message','Такой пользователь уже есть!'));
                        }else {
                            var newUserMysql = {};
                            newUserMysql.TOP_USER = req.body.username.toString();
                            newUserMysql.TOP_LOCATION_ID = req.body.location;
                            newUserMysql.TOP_USER_PASSWORD = bcrypt.encrypt(req.body.pwd1);
                            newUserMysql.TOP_USER_FIO = req.body.fio;
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
                                    var query = 'INSERT into top_users (top_location_id, top_user, top_user_fio, top_user_password) VALUES (:top_location_id, :top_user, :top_user_fio, :top_user_password)';
                                    connection.execute(
                                        query, [newUserMysql.TOP_LOCATION_ID, newUserMysql.TOP_USER, newUserMysql.TOP_USER_FIO, newUserMysql.TOP_USER_PASSWORD], {autoCommit: true},
                                        function (err, result) {
                                            if (err) {
                                                console.log(err);
                                                doRelease(connection);
                                                return done(err);
                                            }
                                            var query = 'select top_user_seq.currval from dual';
                                            connection.execute(
                                                query, {}, {outFormat: oracledb.OBJECT},
                                                function (err, result) {
                                                    if (err) {
                                                        console.log(err);
                                                        doRelease(connection);
                                                        return done(err);
                                                    }
                                                    newUserMysql.TOP_USER_ID = result.rows[0].CURRVAL;
                                                    return done(null, newUserMysql);
                                                });
                                        }
                                    );
                                });
                        }
                    });
            });
    }
));


function doRelease(connection)
{
    connection.close(
        function(err) {
            if (err)
                console.error(err.message);
        });
}

module.exports = passport;