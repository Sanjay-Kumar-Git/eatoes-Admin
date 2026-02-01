const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Appetizer", "Main Course", "Dessert", "Beverage"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    ingredients: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    preparationTime: {
      type: Number,
      min: 0,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

menuItemSchema.index({
  name: "text",
  ingredients: "text",
});

module.exports = mongoose.model('MenuItem', menuItemSchema);