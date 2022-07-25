const Sequelize = require('sequelize');

const sequelize = new Sequelize(
    'shop',
    process.env.NODE_DB_USERNAME,
    process.env.NODE_DB_PASSWORD,
    {
        host: 'localhost',
        dialect: 'mysql',
    },
);

module.exports = sequelize;
