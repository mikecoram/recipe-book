exports.main = function (app) {
    var authController = require('./controllers/auth');
    // Auth middleware
    var isLoggedIn = authController.isLoggedIn;
    var redirectToDashboard = authController.redirectToDashboard;

    authController.registerRoutes(app);

    var mainHandler = require('./handlers/main');
    app.get('/', [redirectToDashboard], mainHandler.home);
    app.get('/dashboard', [isLoggedIn], mainHandler.dashboard);

    var authHandler = require('./handlers/auth');
    app.get('/signup', [redirectToDashboard], authHandler.signup);
    app.get('/login', [redirectToDashboard], authHandler.login);
    app.get('/logout', authHandler.logout);
    app.get('/forgottenpassword', [redirectToDashboard], authHandler.forgottenpassword);
    app.get('/resetpassword/:token', authHandler.resetPassword);

    const recipeHandler = require('./handlers/recipes');
    app.get('/recipes', [isLoggedIn], recipeHandler.all);
    app.get('/recipe/:recipeId', [isLoggedIn], recipeHandler.view);
    app.get('/recipes/new', [isLoggedIn], recipeHandler.new);
    app.post('/recipes/new', [isLoggedIn], recipeHandler.create);

    const preferenceHandler = require('./handlers/preferences');
    app.get('/preferences', [isLoggedIn], preferenceHandler.view);

    var adminController = require('./controllers/admin');
    // Admin middleware
    var isAdmin = adminController.isAdmin;

    app.get('/admin', [isAdmin], require('./handlers/admin').dashboard);
};
