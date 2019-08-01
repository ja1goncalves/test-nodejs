const Sequelize = require('sequelize');
const sequelize = new Sequelize('nodejs_test', 'admin', 'senha_da_nasa', {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate().then(() => {
    console.log('connect database');
}).catch((error) => {
    console.log("don't connect database: " + error);
});

const Post = sequelize.define('post', {
    title: {
        type: Sequelize.STRING,
        require: Sequelize.BOOLEAN
    },
    description: {
        type: Sequelize.TEXT
    }
});

// Post.sync({force: true});

// Post.create({
//     title: "knvosnvdjfnvçd",
//     description: "jncjnvjfvsndljkjbjk bijb aojsdjvojdnovnoj ojnoinpoeafnpinfpwnffw kjbfiwef"
// });

const User = sequelize.define('user', {
    name: {
        type: Sequelize.STRING
    },
    family_name: {
        type: Sequelize.STRING
    },
    age: {
        type: Sequelize.INTEGER
    },
    email: {
        type: Sequelize.STRING
    }
});

// User.sync({force: true});

