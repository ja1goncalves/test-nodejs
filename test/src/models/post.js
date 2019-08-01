const db = require('../database');

const Post = db.sequelize.define('posts', {
    title: {
        type: db.Sequelize.STRING
    },
    description: {
        type: db.Sequelize.TEXT
    }
})

module.exports = Post; 