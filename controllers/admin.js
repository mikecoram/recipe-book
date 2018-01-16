var USER_ROLE = require('../constants').USER_ROLE;

function _isAdmin(user) {
    return user != undefined && user.role === USER_ROLE.ADMIN;
}

exports.isAdmin = function (req, res, next) {
    if (_isAdmin(req.user)) {
        return next();
    }
    res.redirect('/login');
}