const { MongoMemoryServer } = require('mongodb-memory-server');
const { dbService } = require('../services/database.service');
const { DEFAULT_ITEMS } = require('./default_data');
const DB_CONSTS = require('../utils/env');

describe('Database tests', () => {
    let mongoServer;
    let uri = '';

    beforeEach(async () => {
        jest.spyOn(console, "log").mockImplementation(() => { });
        mongoServer = await MongoMemoryServer.create();
        uri = mongoServer.getUri();
    });

    afterEach(async () => {
        await dbService.client.close();
        await mongoServer.stop();
        jest.restoreAllMocks();
    });

    it("should connect to the database", async () => {
        await dbService.connectToServer(uri);
        expect(dbService.client).not.toBeUndefined();
    });

    it("should not connect to the database with invalid URI", async () => {
        const spy = jest.spyOn(console, "error").mockImplementation(() => { });
        await dbService.connectToServer("bad-uri");
        expect(spy).toHaveBeenCalled();
    });

    it("should populate the collections", async () => {
        await dbService.connectToServer(uri);
        await dbService.populateDb(DB_CONSTS.DB_COLLECTION_ITEMS, DEFAULT_ITEMS);

        const collections = await dbService.db.listCollections().toArray();
        expect(collections).toHaveLength(1);

        const item_data = await dbService.db.collection(DB_CONSTS.DB_COLLECTION_ITEMS).find().toArray();
        expect(item_data).toEqual(DEFAULT_ITEMS);
    });

    it("should not populate the collections if they are not empty", async () => {
        await dbService.connectToServer(uri);
        await dbService.db.collection(DB_CONSTS.DB_COLLECTION_ITEMS).insertOne(DEFAULT_ITEMS[0]);

        await dbService.populateDb(DB_CONSTS.DB_COLLECTION_ITEMS, DEFAULT_ITEMS);
        const item_data = await dbService.db.collection(DB_CONSTS.DB_COLLECTION_ITEMS).find().toArray();
        expect(item_data).toHaveLength(1);
    });

});