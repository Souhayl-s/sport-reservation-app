/* eslint-disable no-console */
const { HTTP_STATUS } = require("../utils/http");
const router = require("express").Router();
const { reservationService } = require("../services/reservation.service");

// Fonction fournie pour la réinitialisation de la base de données
router.delete("/reset", async (request, response) => {
  try {
    await reservationService.resetDatabase();
    response.sendStatus(HTTP_STATUS.SUCCESS);
  } catch (error) {
    console.log(error);
    response.sendStatus(HTTP_STATUS.SERVER_ERROR);
  }
});

/**
 * Récupère toutes les réservations
 * @memberof module:routes/reservation/plateaus
 * @name GET /reservations/plateaus
 */
router.get("/plateaus", async (request, response) => {
  try {
    const plateaus = await reservationService.getAllPlateaus();
    response.status(HTTP_STATUS.SUCCESS).json(plateaus);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * Récupère tous les items à réserver
 * @memberof module:routes/reservation
 * @name GET /reservations/items
 */
router.get("/items", async (request, response) => {
  try {
    const items = await reservationService.getAllItems();
    response.status(HTTP_STATUS.SUCCESS).json(items);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * Récupère un plateau par ID
 * @memberof module:routes/reservation
 * @name GET /reservations/plateaus/:plateauId
 */
router.get("/plateaus/:plateauId", async (request, response) => {
  try {
    const reservations = await reservationService.getReservationsForPlateau(
      request.params.plateauId
    );
    response.status(HTTP_STATUS.SUCCESS).json(reservations);
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * Récupère les réservations
 * @memberof module:routes/reservation
 * @name GET /reservations
 */
router.get("/", async (request, response) => {
  try {
    const reservations = await reservationService.getAllReservations();
    response.status(HTTP_STATUS.SUCCESS).json(reservations);
  } catch (error) {
    if (error.message.includes("not found")) {
      return response
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: error.message });
    }
    console.log(error);
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * Ajoute une nouvelle réservation
 * @memberof module:routes/reservation
 * @name POST /reservations
 */
router.post("/", async (request, response) => {
  try {
    const newReservation = await reservationService.createReservation(
      request.body
    );
    response.status(HTTP_STATUS.CREATED).json(newReservation);
  } catch (error) {
    if (error.message.includes("not available")) {
      return response
        .status(HTTP_STATUS.CONFLICT)
        .json({ message: error.message });
    }
    console.log(error);
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

/**
 * Supprime une réservation par ID
 * @memberof module:routes/reservation
 * @name DELETE /reservations/:id
 */
router.delete("/:id", async (request, response) => {
  try {
    const result = await reservationService.deleteReservation(
      request.params.id
    );
    if (result.deletedCount === 1) {
      response
        .status(HTTP_STATUS.SUCCESS)
        .json({ message: "Reservation cancelled successfully" });
    } else {
      response
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ message: "Reservation not found" });
    }
  } catch (error) {
    response.status(HTTP_STATUS.SERVER_ERROR).json(error);
  }
});

module.exports = { router };
