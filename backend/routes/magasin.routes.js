const express = require("express");
const router = express.Router();
const magasinController = require("../controllers/magasin.controller");

// ==========================================
// Middleware Imports
// ==========================================
const auth = require("../middleware/auth.middleware"); 
const { upload } = require("../middleware/upload");

// ==========================================
// Public & Admin Routes
// ==========================================
router.get("/", magasinController.getAllMagasins); 
router.patch("/:id/statut", magasinController.updateMagasinStatut); 

// ==========================================
// Protected Seller Routes
// ==========================================
// Create a store (Now protected by auth, handles "photo" upload)
router.post("/", auth, upload.single("photo"), magasinController.createMagasin); 

// Update their own store details/logo
router.put("/mon-magasin", auth, upload.single("photo"), magasinController.updateMagasin);

// Get a specific store by ID 
router.get("/:id", magasinController.getMagasinByVendeur); 

module.exports = router;