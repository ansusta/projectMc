const express            = require("express");
const router             = express.Router();
const predictionController = require("../controllers/prediction.controller");
const verifyToken        = require("../middleware/auth.middleware");


router.get("/revenue/:id_magasin",
  verifyToken,
  predictionController.getRevenueForecast
);

router.get("/restock/:id_magasin",
  verifyToken,
  predictionController.getRestockAlerts
);

module.exports = router;