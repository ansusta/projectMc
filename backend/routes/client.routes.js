// client.routes.js
const express = require("express");
const router = express.Router();
const clientController = require("../controllers/client.controller");

router.get("/", clientController.getAllClients);
router.get("/:id", clientController.getClientById);
router.patch("/:id/statut", clientController.updateClientStatut);

module.exports = router;