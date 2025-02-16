require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require('./routes/menuRoutes');
const pelangganRoutes = require("./routes/pelangganRoutes");
const pgRoutes = require("./routes/pgRoutes");
const transaksiRoutes = require("./routes/transaksiRoutes");
const reservasiRoutes = require("./routes/reservasiRoutes");
const bahanRoutes = require('./routes/bahanRoutes');
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/auth", authRoutes);
// Rute untuk menu
app.use('/api/menus', menuRoutes);
app.use("/pelanggan", pelangganRoutes);
app.use("/pgw", pgRoutes)
app.use("/transaksi", transaksiRoutes);
app.use("/api", reservasiRoutes);
app.use('/bahan', bahanRoutes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
