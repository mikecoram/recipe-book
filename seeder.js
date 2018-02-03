const { User, Recipe, RecipeTag, Ingredient, RecipeIngredient, Tag } = require('./models');
const RecipeHandler = require('./lib/recipes');

const hash = require('./lib/encryption').generatePasswordHash;
const consts = require('./constants');

main();

async function main() {
    await clear();
    await seed();
    process.exit();
}

async function clear() {
    const DESTROY_SETTINGS = {where:{}};

    await User.destroy({where:{emailAddress:'user@user.com'}});
    await Recipe.destroy(DESTROY_SETTINGS);
    await Ingredient.destroy(DESTROY_SETTINGS);
    await RecipeIngredient.destroy(DESTROY_SETTINGS);
    await Tag.destroy(DESTROY_SETTINGS);
    await RecipeTag.destroy(DESTROY_SETTINGS);
}

async function seed() {
    let user = await User.create({
        emailAddress: 'user@user.com',
        password: hash('password1'),
        status: consts.USER_STATUS.ACTIVE,
        role: consts.USER_ROLE.USER,
        createdAt: new Date(),
        updatedAt: new Date()  
    });

    await RecipeHandler.create(user.id, {
        userId: user.id,
        title: 'Chickpea curry',
        method: 'Dice onion and fry in olive oil for 10 minutes or until browned.\n'+
                'Add garlic and chopped pepper and fry for another minute.\n'+
                'Add chickpeas and stir in to coat with the oil.\n'+
                'Add the seasoning and curry powder and mix.\n'+
                'Add the chopped tomatos and reduce the heat.\n'+
                'Simmer for 10 minutes or until the sauce is reduced.\n'+
                '1 minute before serving, add the chopped spinach and allow to wilt.\n'+
                'Serve with rice.'
    }, [
        { title: 'brown onion', quantity: '1' },
        { title: 'garlic', quantity: '2 cloves' },
        { title: 'bell pepper', quantity: '1' },
        { title: 'chickpeas', quantity: '1 tin' },
        { title: 'curry powder', quantity: '3tsp' },
        { title: 'salt', quantity: 'pinch' },
        { title: 'pepper', quantity: 'pinch' },
        { title: 'spinach', quantity: 'large handful' },
        { title: 'brown rice', quantity: '75g' },
    ], [
        { title: 'vegan' },
        { title: 'healthy' },
    ]);
}