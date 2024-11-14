const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth.routes");
const carRoutes = require("./routes/car.routes");
const { errorHandler } = require("./middleware/error.middleware");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);

// Error handling middleware
app.use(errorHandler);

// Swagger documentation setup
if (process.env.NODE_ENV !== "production") {
  const swaggerUi = require("swagger-ui-express");
  const swaggerDocument = require("./swagger.json");
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
