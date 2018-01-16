var models = require("../models");

describe('models', function () {
    it('sync', function (done) {
        models.sequelize.sync().then(function() {
            done();
        }).catch(function(err) {
            done(err);
        });
    });
}); 
