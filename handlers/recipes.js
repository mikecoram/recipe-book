exports.new = function(req, res) {
    res.render('recipes/new', {
        authorised: true,
        ingredients: [{num: 1}, {num: 2}, {num: 3}],
        steps : [{num: 1}, {num: 2}, {num: 3}]
    });
}

const { Recipe, Ingredient, RecipeIngredient, Tag, RecipeTag } = require('../models');

exports.create = async function(req, res) {
    let data = getData(req);

    let recipe = await Recipe.create(data.recipe);

    data.ingredients.forEach(async iData => {
        let ingredient = await findOrCreate(Ingredient, req.user.id, iData);

        await RecipeIngredient.create({
            recipeId: recipe.id, 
            ingredientId: ingredient.id
        });
    });

    data.tags.forEach(async tData => {
        let tag = await findOrCreate(Tag, req.user.id, tData);

        await RecipeTag.create({
            recipeId: recipe.id,
            tagId: tag.id
        });
    });

    res.redirect('/');
}

async function findOrCreate(model, userId, data) {
    let record = await model.find({
        where: {
            userId: userId,
            title: data.title
        }
    });

    if (!record) {
        record = await model.create(data);
    }

    return record;
}

function getData(req) {
    let data = {};

    data.recipe = getRecipe(
        req.user.id, 
        req.body, 
        getMethod(getSteps(req.body)
    ));
    data.ingredients = getIngredients(req.user.id, req.body);
    data.tags = getTags(req.user.id, req.body);

    return data;
}

function getTags(userId, body) {
    let tags = [];
    body.tags.split(' ').forEach(t => {
        tags.push({
            title: t,
            userId: userId
        });
    })
    return tags;
}

function getRecipe(userId, body, method) {
    return {
        userId: userId,
        title: body.title,
        method: method
    }
}

function getSteps(body) {
    let keys = Object.keys(body);
    let stepKeys = keys.filter(k => {return /step-/.test(k)});

    let steps = [];
    stepKeys.forEach(k => {
        if (body[k]) {
            steps.push(
                body[k]
            );
        }
    });
    return steps;
}

function getMethod(steps) {
    let method = '';
    steps.forEach(s => {
        method += s+'\n';
    });
    return method;
}

function getIngredients(userId, body) {
    let keys = Object.keys(body);
    let ingQuantityKeys = keys.filter(k => {return /ing-quantity/.test(k)});
    let ingKeys = keys.filter(k => {return /ing-[0-9]/.test(k)});

    ingredients = [];
    ingKeys.forEach(k => {
        let num = Number.parseInt(/[0-9]+/.exec(k)[0]);

        if (body[k]) {
            ingredients.push({
                userId: userId,
                title: body[k],
                quantity: body['ing-quantity-'+num]
            });
        }
    });

    return ingredients;
}