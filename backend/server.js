const express = require("express");
const cors = require("cors");
const claimRoutes = require("./routes/claimRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/claims", claimRoutes);

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});

const path = require('path');

app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});
