const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    tags: {
      car_type: {
        type: String,
        required: true,
      },
      company: {
        type: String,
        required: true,
      },
      dealer: {
        type: String,
        required: true,
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search functionality
carSchema.index({
  title: "text",
  description: "text",
  "tags.car_type": "text",
  "tags.company": "text",
  "tags.dealer": "text",
});

const Car = mongoose.model("Car", carSchema);

module.exports = Car;
