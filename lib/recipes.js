const { Recipe, Ingredient, RecipeIngredient, Tag, RecipeTag } = require('../models');
const Op = require('sequelize').Op;

exports.create = create;
exports.getAll = getAll;
exports.get = get;

const INCLUDE = [{
    model: RecipeIngredient,
    as: 'recipeIngredients',
    include: [{
        model: Ingredient,
        as: 'ingredient'
    }]
}, {
    model: RecipeTag,
    as: 'recipeTags',
    include: [{
        model: Tag,
        as: 'tag'
    }]
}];

async function get(userId, recipeId) {
    let raw = await Recipe.find({
        where: {
            id: recipeId,
            userId: userId
        },
        include: INCLUDE
    });

    return parseRecipe(raw);
}

function buildQuery(userId, tagIds, ingredientIds) {
    let tagWhere = {};
    let ingredientWhere = {};
    
    if (tagIds) {
        tagWhere = {
            id: {
                [Op.in]: tagIds
            }
        };
    }

    if (ingredientIds) {
        ingredientWhere = {
            id: {
                [Op.in]: ingredientIds
            }
        };
    }

    let query = {
        where: {
            userId: userId
        },
        include: INCLUDE
    };

    return query;
}

async function getAll(userId, tagIds, ingredientIds) {
    let raw = await Recipe.findAll(
        buildQuery(userId, tagIds, ingredientIds)
    );

    if (tagIds) {
        raw = filterByTagIds(raw, tagIds);
    }

    let recipes = [];    
    raw.forEach(r => {
        recipes.push(parseRecipe(r));
    });

    return recipes;
}

function filterByTagIds(raw, filterTagIds) {
    return raw.filter(r => {
        let tagIds = [];

        for (let rt of r.recipeTags) {
            tagIds.push(rt.tag.id);
        }

        let containsAllTags = true;

        for (let ti of filterTagIds) {
            if (tagIds.indexOf(ti) <= -1) {
                containsAllTags = false;
                break;
            }
        }

        return containsAllTags;
    });
}

function parseRecipe(raw) {
    let ingredients = [];
    let tags = [];

    raw.recipeIngredients.forEach(ri => {
        ingredients.push(ri.ingredient);
    });

    raw.recipeTags.forEach(rt => {
        tags.push(rt.tag);
    });

    return {
        id: raw.id,
        title: raw.title,
        method: raw.method,
        ingredients: ingredients,
        tags: tags
    };
}

async function create(req) {
    let data = parseRecipeData(req);

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

function parseRecipeData(req) {
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
    if (body.tags == '') 
        return [];

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