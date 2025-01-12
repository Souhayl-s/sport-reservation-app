const { MongoClient, ServerApiVersion } = require('mongodb');
const DB_CONSTS = require('../utils/env');

class DatabaseService {
  /**
   * @param {string} collectionName 
   * @param {Array} data tableau contenant les documents à mettre dans la collection
   */
  async populateDb(collectionName, data) {
    const collection = this.db.collection(collectionName);
    const isEmpty = (await collection.findOne()) === null;
    const dataIsArray = Array.isArray(data);
    if(dataIsArray && isEmpty){
      await collection.insertMany(data);
    }
  }

  /**
   * Établir la connection avec la base de données MongoDB
   * @param {string} uri URI de la base de données MongoDB 
   */
  async connectToServer(uri) {
    try {
      this.client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
      });
      await this.client.connect();
      this.db = this.client.db(DB_CONSTS.DB_DB);
      // eslint-disable-next-line no-console
      console.log('Successfully connected to MongoDB.');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }
}

const dbService = new DatabaseService();

module.exports = { dbService };