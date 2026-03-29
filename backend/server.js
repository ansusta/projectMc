require("dotenv").config();
const express = require('express');
const cors = require('cors');
const authRoutes = require("./routes/auth.routes");
const clientRoutes = require('./routes/client.routes');
const utilisateurRoutes = require('./routes/utilisateur.routes');
const magasinRoutes = require("./routes/magasin.routes");
const produitRoutes =require("./routes/produit.routes");
const panierRoutes =require("./routes/panier.routes");


const app = express();
const PORT = 5000;

app.use((req, res, next) => {
  console.log(` ${req.method} ${req.originalUrl}`);
  console.log(` Body:`, req.body ? JSON.stringify(req.body, null, 2) : 'EMPTY');
  console.log('---');
  next();
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  console.log(' ROOT ROUTE HIT');
  res.send("Backend is working");
});

app.use("/api/auth", (req, res, next) => {
  console.log(' AUTH ROUTES HIT:', req.method, req.path);
  next();
}, authRoutes);

app.use("/api/clients", (req, res, next) => {
  console.log(' CLIENT ROUTES HIT:', req.method, req.path);
  next();
}, clientRoutes);

app.use("/api/utilisateurs", (req, res, next) => {
  console.log(' UTILISATEUR ROUTES HIT:', req.method, req.path);
  next();
}, utilisateurRoutes);


app.use("/api/magasin", magasinRoutes);
app.use("/api/produit",produitRoutes);
app.use("/api/panier",panierRoutes);
app.use((req, res) => {
  console.log(' 404 NOT FOUND:', req.method, req.originalUrl);
  res.status(404).json({ error: 'Route not found', url: req.originalUrl });
});
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.message);
  console.error(' STACK:', err.stack);
  res.status(500).json({ 
    error: 'Server error', 
    details: err.message || 'Unknown error'
  });
});

app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
  console.log(' Debug mode: ACTIVE');
});
