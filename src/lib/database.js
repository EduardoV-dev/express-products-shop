require('dotenv').config();
const MongoDB = require('mongodb');

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
const CLUSTER = process.env.DB_CLUSTER;
const DATABASE = process.env.DB_NAME;

const CONNECTION_STRING = `mongodb+srv://${USERNAME}:${PASSWORD}@${CLUSTER}/?retryWrites=true&w=majority`;

let db = null;

const connectToDatabase = async () => {
    const client = new MongoDB.MongoClient(CONNECTION_STRING);

    try {
        await client.connect();

        db = client.db(DATABASE);

        console.log('Connected!');
    } catch (error) {
        throw new Error(error);
    }
};

const getDb = () => {
    if (db) return db;

    throw new Error('Database has not been initialized');
};

module.exports = {
    connectToDatabase,
    getDb,
};
