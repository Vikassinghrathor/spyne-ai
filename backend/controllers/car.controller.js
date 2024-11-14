const Car = require("../models/car.model");
const { uploadToCloudinary } = require("../utils/cloudinary");

const createCar = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const images = req.files;

    if (!images || images.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    if (images.length > 10) {
      return res.status(400).json({ error: "Maximum 10 images allowed" });
    }

    // Upload images to cloudinary and get URLs
    const imagePromises = images.map((image) => uploadToCloudinary(image.path));
    const imageUrls = await Promise.all(imagePromises);

    const car = await Car.create({
      title,
      description,
      images: imageUrls,
      tags: JSON.parse(tags),
      owner: req.user._id,
    });

    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ error: "Error creating car listing" });
  }
};

const getCars = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { owner: req.user._id };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "tags.car_type": { $regex: search, $options: "i" } },
        { "tags.company": { $regex: search, $options: "i" } },
        { "tags.dealer": { $regex: search, $options: "i" } },
      ];
    }

    const cars = await Car.find(query).sort({ createdAt: -1 });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: "Error fetching cars" });
  }
};

const getCarById = async (req, res) => {
  try {
    const car = await Car.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json(car);
  } catch (error) {
    res.status(500).json({ error: "Error fetching car details" });
  }
};

const updateCar = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    const newImages = req.files;

    const car = await Car.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    // Update basic information
    car.title = title || car.title;
    car.description = description || car.description;
    if (tags) {
      car.tags = JSON.parse(tags);
    }

    // Handle new images if provided
    if (newImages && newImages.length > 0) {
      if (newImages.length > 10) {
        return res.status(400).json({ error: "Maximum 10 images allowed" });
      }

      const imagePromises = newImages.map((image) =>
        uploadToCloudinary(image.path)
      );
      const imageUrls = await Promise.all(imagePromises);
      car.images = imageUrls;
    }

    await car.save();
    res.json(car);
  } catch (error) {
    res.status(500).json({ error: "Error updating car" });
  }
};

const deleteCar = async (req, res) => {
  try {
    const car = await Car.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }

    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting car" });
  }
};

module.exports = {
  createCar,
  getCars,
  getCarById,
  updateCar,
  deleteCar,
};
