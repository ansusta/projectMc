const express = require("express");
const router = express.Router();
const produitController = require("../controllers/produit.controller");

router.get("/", produitController.searchProduits);
router.get("/:id", produitController.getProduitById);

module.exports = router;