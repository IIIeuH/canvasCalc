// var passport       = require('passport');
// var LocalStrategy  = require('passport-local').Strategy;
//
//
// passport.serializeUser(function(user, done) {
//     done(null, user.id);
// });
//
// passport.deserializeUser(function(id, done) {
//     User.findById(id, function(err, user) {
//         done(err, user);
//     });
// });
//
// passport.use('local', new LocalStrategy({
//     usernameField: 'username',
//     passwordField: 'password',
//     passReqToCallback : true
// }, function(req, username, password,done){
//     if(username === 'admin' && password === 'admin'){
//         var user = {
//           id: 1,
//           username: 'admin',
//           password: 'admin'
//         };
//         console.log(user);
//         return done(null, user)
//     }else if(username !== 'admin'){
//         return done(null, false, req.flash('message','Пользователь '+username+' не найден!'))
//     }else{
//         return done(null, false, req.flash('message','Пароль введен не верно!'));
//     }
// }));
//
// module.exports = passport;