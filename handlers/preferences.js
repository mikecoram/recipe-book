exports.view = function(req, res) {
    res.render('preferences/view', {
        authorised: true
    });
}