const express = require("express");
const router = express.Router();
const produitController = require("../controllers/produit.controller");

// ==========================================
// Middleware Imports
// ==========================================
const auth = require("../middleware/auth.middleware"); 
const upload = require("../middleware/upload"); 

// ==========================================
// Public Routes (Visitors, Clients, Sellers, Admins)
// ==========================================
router.get("/", produitController.searchProduits);
router.get("/:id", produitController.getProduitById);

// ==========================================
// Protected Routes (Sellers Only)
// ==========================================
// Route to create a product (Handles the image upload and the database save)
router.post("/", auth, upload.single("image"), produitController.createProduit);

// Route to update an existing product
router.put("/:id", auth, upload.single("image"), produitController.updateProduit);

// Route to delete a product
router.delete("/:id", auth, produitController.deleteProduit);

module.exports = router;