const dotenv = require('dotenv');

dotenv.config();

const dns = require('dns');

dns.setServers(['1.1.1.1', '8.8.8.8']);

const { MongoClient } = require('mongodb');

let dbClient;
let client;

const encodeMongoURI = (uri) => {
  if (!uri) return uri;

  try {
    const uriPattern = /^(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@(.+)$/;
    const match = uri.match(uriPattern);

    if (match) {
      const [, protocol, username, password, rest] = match;
      const encodedUsername = encodeURIComponent(username);
      const encodedPassword = encodeURIComponent(password);
      return `${protocol}${encodedUsername}:${encodedPassword}@${rest}`;
    }

    return uri;
  } catch {
    return uri;
  }
};

const initDb = (callback) => {
  if (dbClient) {
    return callback(null, dbClient);
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return callback(new Error('MONGODB_URI is required in environment variables'));
  }

  const encodedUri = encodeMongoURI(uri);

  const clientOptions = {
    family: 4,
    retryWrites: true,
    writeConcern: { w: 'majority' },
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000
  };

  client = new MongoClient(encodedUri, clientOptions);

  client
    .connect()
    .then((connectedClient) => {
      dbClient = connectedClient;
      callback(null, dbClient);
    })
    .catch((error) => {
      callback(error);
    });
};

const getDatabase = () => {
  if (!dbClient) {
    throw new Error('Database connection not initialized');
  }
  return dbClient.db();
};

const closeDatabase = async () => {
  if (client) {
    await client.close();
    dbClient = undefined;
    client = undefined;
  }
};

process.on('SIGINT', async () => {
  await closeDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeDatabase();
  process.exit(0);
});

module.exports = { initDb, getDatabase, closeDatabase };
