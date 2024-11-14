const express = require("express");
const multer = require("multer");
const auth = require("../middleware/auth.middleware");
const {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
} = require("../controllers/car.controller");

const router = express.Router();

// Multer configuration for handling file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image! Please upload only images."), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Routes
router.post("/", auth, upload.array("images", 10), createCar);
router.get("/", auth, getCars);
router.get("/:id", auth, getCarById);
router.put("/:id", auth, upload.array("images", 10), updateCar);
router.delete("/:id", auth, deleteCar);

module.exports = router;
