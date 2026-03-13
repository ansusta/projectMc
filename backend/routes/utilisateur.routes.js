const express = require("express");
const router = express.Router();
const utilisateurController = require("../controllers/utilisateur.controller");

router.get("/", utilisateurController.getAllUtilisateurs);
router.get("/:id", utilisateurController.getUtilisateurById);
router.patch("/:id/role", utilisateurController.updateRole);

module.exports = router;