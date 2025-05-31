const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoute=require("./routes/authRoutes")
const propertyRoute=require("./routes/propertyRoute")
const favoriteRoute=require("./routes/favoriteRoute")

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/properties", propertyRoute);
app.use("/api/favorites",  favoriteRoute);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
