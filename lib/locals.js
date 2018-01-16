function addLocal (app, key, value) {
    app.locals[key] = value;
}

// Store constants that can be accessed by the view engine (eg. app name)
exports.populate = function (app) {
    addLocal(app, 'AppTitle', 'Recipe Book');
}