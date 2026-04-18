const express = require("express");
const router = express.Router();
const produitController = require("../controllers/produit.controller");
const verifyToken = require("../middleware/auth.middleware");

// Public routes
router.get("/", produitController.searchProduits);
router.get("/magasin/:id", produitController.getByMagasin);
router.get("/:id", produitController.getProduitById);

// Protected routes (require authentication)
router.post("/", verifyToken, produitController.createProduit);
router.patch("/:id", verifyToken, produitController.updateProduit);
router.delete("/:id", verifyToken, produitController.deleteProduit);

module.exports = router;