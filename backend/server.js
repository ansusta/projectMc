const express = require('express');
const cors = require('cors');
const connectDB = require("./db");

const app = express();
const PORT = 5000;
app.use(cors());
app.use(express.json());
connectDB();

app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});



app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
