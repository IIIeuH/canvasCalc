// var bcrypt = require('bcrypt'),
//     saltRounds = 10;

var crypto = require('crypto'),
    algorithm = 'aes192',
    password = 'd6F3sdfdnza23q4rwzgvfsE#rq45$fsdfEfeq';

// module.exports.encrypt = function (password){
//     return bcrypt.hashSync(password, saltRounds);
// };
//
// module.exports.decrypt = function (password, hash){
//     return bcrypt.compareSync(password, hash);
// };



module.exports.encrypt = function (text){
    var cipher = crypto.createCipher(algorithm,password);
    var crypted = cipher.update(text,'utf8','hex');
    crypted += cipher.final('hex');
    return crypted;
};

module.exports.decrypt = function (text){
    var decipher = crypto.createDecipher(algorithm,password);
    var dec = decipher.update(text,'hex','utf8');
    dec += decipher.final('utf8');
    return dec;
};