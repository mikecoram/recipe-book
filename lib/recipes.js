const { Recipe, Ingredient, RecipeIngredient, Tag, RecipeTag } = require('../models');
const Op = require('sequelize').Op;

exports.create = create;
exports.getAll = getAll;
exports.get = get;
exports.parseRecipeCreationRequest = parseRecipeCreationRequest;

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

const TAG_COLOR_SCHEMES = [
    {bgColor: '#6699ff', textColor: 'black'},
    {bgColor: '#33ccff', textColor: 'white'},
    {bgColor: '#66ff99', textColor: 'black'},
    {bgColor: '#ffff66', textColor: 'black'},
    {bgColor: '#ff9966', textColor: 'black'},
    {bgColor: '#ff6699', textColor: 'black'},
    {bgColor: '#ff66ff', textColor: 'black'},
    {bgColor: '#ff3300', textColor: 'black'},
    {bgColor: '#cc9900', textColor: 'black'},
    {bgColor: '#009933', textColor: 'black'},
];

async function getNewTagColor(userId) {
    let userTags = await Tag.findAll({
        where: {
            userId: userId
        }
    });

    let usedColors = [];
    let unusedColors = TAG_COLOR_SCHEMES;

    for (let tag of userTags) {
        let color = unusedColors.find(cs => { return cs.bgColor == tag.color });

        if (color) {
            let index = unusedColors.indexOf(color);
            unusedColors.splice(index, 1);
        }
    }

    let randomColor = unusedColors[Math.floor(Math.random() * unusedColors.length)].bgColor;
    return randomColor;
}

async function create(userId, recipeData, ingredientData, tagData) {
    recipeData.userId = userId;
    let recipe = await Recipe.create(recipeData);

    for (let iData of ingredientData) {
        iData.userId = userId;
        let ingredient = await findOrCreate(Ingredient, userId, iData);

        await RecipeIngredient.create({
            recipeId: recipe.id, 
            ingredientId: ingredient.id
        });
    }

    for (let tData of tagData) {
        tData.userId = userId;
        tData.color = await getNewTagColor(userId);
        let tag = await findOrCreate(Tag, userId, tData);

        await RecipeTag.create({
            recipeId: recipe.id,
            tagId: tag.id
        });
    }
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

function parseRecipeCreationRequest(req) {
    let data = {};

    data.recipe = getRecipe(
        req.body, 
        getMethod(getSteps(req.body)
    ));
    data.ingredients = getIngredients(req.body);
    data.tags = getTags(req.body);

    return data;
}

function getTags(body) {
    if (body.tags == '') 
        return [];

    let tags = [];
    body.tags.split(' ').forEach(t => {
        tags.push({
            title: t,
        });
    })
    return tags;
}

function getRecipe(body, method) {
    return {
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

function getIngredients(body) {
    let keys = Object.keys(body);
    let ingQuantityKeys = keys.filter(k => {return /ing-quantity/.test(k)});
    let ingKeys = keys.filter(k => {return /ing-[0-9]/.test(k)});

    ingredients = [];
    ingKeys.forEach(k => {
        let num = Number.parseInt(/[0-9]+/.exec(k)[0]);

        if (body[k]) {
            ingredients.push({
                title: body[k],
                quantity: body['ing-quantity-'+num]
            });
        }
    });

    return ingredients;
}