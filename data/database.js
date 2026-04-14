const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');

dotenv.config();

let dbClient;

const initDb = async (callback) => {
  try {
    if (dbClient) {
      return callback(null, dbClient);
    }

    const uri = process.env.MONGODB_URI;
    if (!uri) {
      return callback(new Error('MONGODB_URI is required in environment variables'));
    }

    const client = new MongoClient(uri);
    dbClient = await client.connect();
    callback(null, dbClient);
  } catch (error) {
    callback(error);
  }
};

const getDatabase = () => {
  if (!dbClient) {
    throw new Error('Database connection not initialized');
  }
  return dbClient.db();
};

module.exports = { initDb, getDatabase };
