const Sequelize = require('sequelize');

const sequelize = new Sequelize('shopping-cart', 'root', 'shoppingcart', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;

