require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
const CLUSTER = process.env.DB_CLUSTER;
const DATABASE = process.env.DB_NAME;
const CONNECTION_STRING = `mongodb+srv://${USERNAME}:${PASSWORD}@${CLUSTER}/?retryWrites=true&w=majority`;

const connect = () =>
    mongoose.connect(CONNECTION_STRING, { dbName: DATABASE }).catch(console.error);

module.exports = {
    connect,
    CONNECTION_STRING,
};
