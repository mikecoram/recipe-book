describe('database', function () {
    it('connects', function (done) {
        var env = 'test';
        var Sequelize = require('sequelize');
        var config = require(__dirname + '/../config/config.json')[env];
        var sequelize = new Sequelize(config.database, config.username, config.password, config);
        sequelize.authenticate().then(function (res) {
            done();
        }, function (err) {
            done(err);
        });
    });
});