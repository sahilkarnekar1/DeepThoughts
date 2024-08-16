const { MongoClient } = require('mongodb');

let db;

const connectDB = async () => {
  try {
    const client = new MongoClient(process.env.MONGO_URI, { useUnifiedTopology: true });
    await client.connect();
    db = client.db();
    console.log('Database connection established.');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

const getDB = () => {
  if (!db) throw new Error('Database not initialized');
  return db;
};

module.exports = {
  connectDB,
  getDB
};
