exports.signup = function (req, res) {
    res.render('signup', {
        error: req.flash('error')
    });
};

exports.login = function (req, res) {
    res.render('login', {
        error: req.flash('error')
    });
};

exports.logout = function (req, res) {
    req.session.destroy(function (err) {
        res.redirect('/');
    });
}

exports.forgottenpassword = function (req, res) {
    res.render('forgottenpassword', {
        info: req.flash('info'),
        error: req.flash('error')
    });
}

exports.resetPassword = function (req, res) {
    res.render('resetpassword', {
        success: req.flash('success'),
        error: req.flash('error')
    });
}