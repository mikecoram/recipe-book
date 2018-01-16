var bCrypt = require('bcrypt-nodejs');

exports.generatePasswordHash = function (password) {
    return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
}

exports.passwordMatchesHash = function (password, hash) {
    return bCrypt.compareSync(password, hash);
}