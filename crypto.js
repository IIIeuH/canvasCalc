var bcrypt = require('bcrypt'),
    saltRounds = 10;

module.exports.encrypt = function (password){
    return bcrypt.hashSync(password, saltRounds);
};

module.exports.decrypt = function (password, hash){
    return bcrypt.compareSync(password, hash);
};