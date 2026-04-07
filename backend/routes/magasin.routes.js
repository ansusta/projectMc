const express = require("express");
const router = express.Router();
const magasinController = require("../controllers/magasin.controller");

router.post("/", magasinController.createMagasin);           
router.get("/", magasinController.getAllMagasins);           
router.get("/:id", magasinController.getMagasinByVendeur);   
router.patch("/:id/statut", magasinController.updateMagasinStatut); 

module.exports = router;