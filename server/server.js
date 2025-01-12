const express = require('express');
const cors = require('cors');
const DB_CONSTS = require('./utils/env');

const { dbService } = require('./services/database.service');
const { reservationService } = require('./services/reservation.service');
const reservationRouter = require('./routes/reservations');

const app = express();
const PORT = 5020;
const SIZE_LIMIT = '10mb';

app.use(cors({ origin: '*' }));

// Affichage de nouvelles requêtes dans la console à des fins de débogage
app.use((request, response, next) => {
    // eslint-disable-next-line no-console
    console.log(`New HTTP request: ${request.method} ${request.url}`);
    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: SIZE_LIMIT }));

app.use('/reservations', reservationRouter.router);


const server = app.listen(PORT, () => {
    dbService.connectToServer(DB_CONSTS.DB_URL).then(() => {
        reservationService.populateDb();
        // eslint-disable-next-line no-console
        console.log(`Listening on port ${PORT}.`);

    });
});

module.exports = server;