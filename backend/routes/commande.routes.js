const express = require("express");
const router = express.Router();
const commandeController = require("../controllers/commande.controller");
const verifyToken = require("../middleware/auth.middleware");

router.use(verifyToken);

// Order matters — specific paths before :id
router.get("/historique",  commandeController.getHistorique);
router.get("/en-cours",    commandeController.getCommandesEnCours);
router.post("/",           commandeController.passerCommande);
router.get("/:id",         commandeController.getCommandeById);
router.put("/:id/annuler", commandeController.annulerCommande);

module.exports = router;