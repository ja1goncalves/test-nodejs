const Sequelize = require('sequelize');
const sequelize = new Sequelize('nodejs_test', 'admin', 'senha_da_nasa', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}