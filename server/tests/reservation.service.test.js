/* eslint-disable no-unused-vars */
const { reservationService } = require('../services/reservation.service');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { dbService } = require('../services/database.service');

const DB_CONSTS = require('../utils/env');
const { DEFAULT_ITEMS, DEFAULT_PLATEAUS } = require('./default_data');


describe('ReservationService', () => {

    let mongoServer;
    const testPath = 'testPath';

    const MOCK_RESERVATION = {
        plateauId: DEFAULT_PLATEAUS[0].id,
        plateauName: DEFAULT_PLATEAUS[0].name,
        itemIds: [DEFAULT_ITEMS[0].id],
        startTime: new Date('2024-12-01T10:00:00.000Z'),
        endTime: new Date('2024-12-01T11:00:00.000Z'),
        clientName: 'John Doe'
    };

    beforeEach(async () => {
        jest.spyOn(console, "log").mockImplementation(() => { });
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await dbService.connectToServer(uri);
        await dbService.db.collection(DB_CONSTS.DB_COLLECTION_PLATEAUS).insertMany(structuredClone(DEFAULT_PLATEAUS));
        await dbService.db.collection(DB_CONSTS.DB_COLLECTION_ITEMS).insertMany(structuredClone(DEFAULT_ITEMS));

        reservationService.dbService = dbService;

        const mockFileSystemManager = {
            readFile: jest.fn().mockResolvedValue(JSON.stringify(DEFAULT_PLATEAUS))
        };
        reservationService.fileSystemManager = mockFileSystemManager;
        reservationService.JSON_PATH_ITEMS = testPath;
    });

    afterEach(async () => {
        await dbService.client.close();
        await mongoServer.stop();
        jest.restoreAllMocks();
    });

    it('populateDb should call readFile and populateDb functions', async () => {
        const fsSpy = jest.spyOn(reservationService.fileSystemManager, "readFile");
        const dbSpy = jest.spyOn(reservationService.dbService, "populateDb");
        await reservationService.populateDb();
        expect(fsSpy).toHaveBeenCalled();
        expect(dbSpy).toHaveBeenCalledTimes(2);
    });

    describe('Database accessors tests', () => {


        it('getAllItems should return all items', async () => {
            // Retrait du _id unique attribué par MongoDB
            const items = (await reservationService.getAllItems()).map(({ _id, ...rest }) => rest);
            expect(items).toEqual(DEFAULT_ITEMS);
        });

        it('getAllPlateaus should return all plateaus', async () => {
            const plateaus = (await reservationService.getAllPlateaus()).map(({ _id, ...rest }) => rest);
            expect(plateaus).toEqual(DEFAULT_PLATEAUS);
        });

        it('getItemById should return the item with the given id', async () => {
            const item = await reservationService.getItemById(DEFAULT_ITEMS[0].id);
            expect(item).toEqual(expect.objectContaining(DEFAULT_ITEMS[0]));
        });

        it('getPlateauById should return the plateau with the given id', async () => {
            const plateau = await reservationService.getPlateauById(DEFAULT_PLATEAUS[0].id);
            expect(plateau).toEqual(expect.objectContaining(DEFAULT_PLATEAUS[0]));
        });

        it('getAllReservations should return all reservations', async () => {
            await reservationService.reservationsCollection.insertOne(structuredClone(MOCK_RESERVATION));

            const reservations = await reservationService.getAllReservations();
            expect(reservations).toHaveLength(1);
        });

        it('getReservationsById should return the reservation with the given id', async () => {
            const reservation = await reservationService.reservationsCollection.insertOne(structuredClone(MOCK_RESERVATION));

            const reservationFound = await reservationService.getReservationById(reservation.insertedId);
            expect(reservationFound).toEqual(expect.objectContaining(MOCK_RESERVATION));
        });

        it('getReservationsForPlateau should return all reservations for the given plateau', async () => {
            await reservationService.reservationsCollection.insertOne(structuredClone(MOCK_RESERVATION));
            const reservations = await reservationService.getReservationsForPlateau(DEFAULT_PLATEAUS[0].id);
            expect(reservations).toHaveLength(1);
        });

    });

    describe('Plateau reservation tests', () => {
        it('checkPlateauAvailability should return true if the plateau is available', async () => {
            const isAvailable = await reservationService.checkPlateauAvailability(DEFAULT_PLATEAUS[0].id, '2024-12-01T10:00:00.000Z', '2024-12-01T11:00:00.000Z');
            expect(isAvailable).toBe(true);
        });

        it('checkPlateauAvailability should return false if the plateau is not available', async () => {
            await reservationService.reservationsCollection.insertOne(structuredClone(MOCK_RESERVATION));

            const isAvailable = await reservationService.checkPlateauAvailability(DEFAULT_PLATEAUS[0].id, '2024-12-01T10:00:00.000Z', '2024-12-01T10:30:00.000Z');
            expect(isAvailable).toBe(false);
        });

        it('checkPlateauAvailability should return true if the plateau is available at the end of a reservation', async () => {
            await reservationService.reservationsCollection.insertOne(structuredClone(MOCK_RESERVATION));

            const isAvailable = await reservationService.checkPlateauAvailability(DEFAULT_PLATEAUS[0].id, '2024-12-01T11:00:00.000Z', '2024-12-01T12:00:00.000Z');
            expect(isAvailable).toBe(true);
        });
    });

    describe('Reservation creation and deletion tests', () => {
        it('createReservation should create a reservation', async () => {
            const reservation = await reservationService.createReservation(structuredClone(MOCK_RESERVATION));
            expect(reservation).toEqual(expect.objectContaining(MOCK_RESERVATION));
        });

        it('createReservation should handle a reservation without items', async () => {
            const reservationWithoutItems = structuredClone(MOCK_RESERVATION);
            delete reservationWithoutItems.itemIds;
            const reservation = await reservationService.createReservation(reservationWithoutItems);
            expect(reservation).toEqual(expect.objectContaining(reservationWithoutItems));
        });

        it('createReservation should throw an error if the plateau is not available', async () => {
            await reservationService.reservationsCollection.insertOne(structuredClone(MOCK_RESERVATION));

            await expect(reservationService.createReservation(structuredClone(MOCK_RESERVATION)))
                .rejects.toThrow('Requested time slot not available');
        });

        it('createReservation should throw an error if the plateau is invalid', async () => {
            await expect(reservationService.createReservation({
                ...structuredClone(MOCK_RESERVATION),
                plateauId: 'invalidId'
            })).rejects.toThrow('Invalid plateau');
        });

        it('createReservation should throw an error if some items are not allowed', async () => {
            await expect(reservationService.createReservation({
                ...structuredClone(MOCK_RESERVATION),
                itemIds: ['invalidId']
            })).rejects.toThrow('Some items are not allowed for this plateau');
        });

        it('deleteReservation should delete a reservation', async () => {
            const reservation = await reservationService.reservationsCollection.insertOne(structuredClone(MOCK_RESERVATION));
            await reservationService.deleteReservation(reservation.insertedId);
            const reservations = await reservationService.getAllReservations();
            expect(reservations).toHaveLength(0);
        });

        it('deleteReservation should not delete if the reservation does not exist', async () => {
            await reservationService.reservationsCollection.insertOne(structuredClone(MOCK_RESERVATION));

            await reservationService.deleteReservation('invalidId');
            const reservations = await reservationService.getAllReservations();
            expect(reservations).toHaveLength(1);
        });

    });

    describe('Debug routes tests', () => {

        it('should reset database', async () => {
            const spy = jest.spyOn(reservationService, "populateDb");
            await reservationService.resetDatabase();

            const reservations = await reservationService.getAllReservations();
            const collections = await dbService.db.listCollections().toArray();

            expect(spy).toHaveBeenCalled();
            expect(collections).toHaveLength(2);
            expect(reservations).toHaveLength(0);
        });
    });

});