const recipesHandler = require('../lib/recipes');
const tagHandler = require('../lib/tags');

exports.view = async function(req, res) {
    let recipe = await recipesHandler.get(req.user.id, req.params.recipeId);
    res.render('recipes/view', {
        authorised: true,
        recipe: recipe
    });
}

exports.all = async function(req, res) {
    let recipes = await recipesHandler.getAll(req.user.id);
    let tags = await tagHandler.all(req.user.id);
    console.log(tags);
    res.render('recipes/all', {
        authorised: true,
        recipes: recipes,
        tags: tags
    });
}

exports.new = function(req, res) {
    res.render('recipes/new', {
        authorised: true,
        ingredients: [{num: 1}, {num: 2}, {num: 3}],
        steps : [{num: 1}, {num: 2}, {num: 3}]
    });
}

exports.create = async function(req, res) {
    await recipesHandler.create(req);
    res.redirect('/recipes/new');
}