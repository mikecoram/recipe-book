exports.new = function(req, res) {
    res.render('recipes/new', {
        authorised: true
    });
}