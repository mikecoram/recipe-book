### Global Dependencies
node,
npm

### Requirements
PostgreSQL database (Postgres.app is good for local testing on a Mac)

### Setup
Install node/npm.
~~~~ 
git clone https://mikecoram@bitbucket.org/mikecoram/recipe-book.git
npm install
~~~~
Set up a postgreSQL database and then edit config/config.json to point to the database.
Change the admin details in 'seeders/*-init.js'
Initialise the database:
~~~~
sequelize db:migrate
sequelize db:seed:all
~~~~

### Sequelize
Creating a new model (generates model and migration):
~~~~
sequelize model:create --name Name --attributes "attr:type, attr2:type"
~~~~

Apply all migrations
~~~~
sequelize db:migrate
~~~~

Undo last migration
~~~~
sequelize db:migrate:undo
~~~~

Apply all seeders
~~~~
sequelize db:seed:all
~~~~

Undo all seeders
~~~~
sequelize db:seed:undo:all
~~~~

Create new seeder
~~~~
sequelize db:seed:create
~~~~

Foreign key examples
In model
~~~~
Quiz.associate = function(models) {
    // Foreign key
    Quiz.belongsTo(models.User, {
        foreignKey: 'userId',
        targetKey: 'id',
        as: 'user'
    });

    // Parent of another model
    Quiz.hasMany(models.Section, {
        foreignKey: 'quizId',
        as: 'sections'
    });
}
~~~~
In migration
~~~~
onDelete: 'CASCADE',
references: {
    model: 'Users',
    key: 'id',
    as: 'user'
}
~~~~

### Notable
Edit config/config.json to configure database and email settings
Edit app name etc. in lib/constants.js
Create a credentials.json file in the config folder like so:
~~~~
{
    "cookieSecret": "your cookie secret"
    "sessionSecret": "your session secret",
}
~~~~
Constants are stored in Constants.js including User roles enum

### Running
~~~~
npm start
~~~~

### Unit Testing
~~~~
npm test
~~~~
