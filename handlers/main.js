exports.home = function (req, res) {
    res.render('home');
}

exports.dashboard = function (req, res) {
    res.render('dashboard', {
        success: req.flash('success'),
        authorised: req.user != undefined
    });
}