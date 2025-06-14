const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema({
  resource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resource",
    required: true,
  },
  quantity: {
    type: Number,
    required: [true, "Ingredient quantity is required"],
    min: [0, "Quantity cannot be negative"],
  },
});

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Menu item name is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  image: {
    type: String,
  },
  ingredients: [ingredientSchema],
  preparationTime: {
    type: Number, // in minutes
    default: 5,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Method to check if item can be made based on available resources
menuItemSchema.methods.canBeMade = async function () {
  const Resource = require("./resourceModel");

  for (let ingredient of this.ingredients) {
    const resource = await Resource.findById(ingredient.resource);
    if (!resource || resource.currentStock < ingredient.quantity) {
      return false;
    }
  }
  return true;
};

// Method to deduct ingredients from stock
menuItemSchema.methods.deductIngredients = async function () {
  const Resource = require("./resourceModel");

  for (let ingredient of this.ingredients) {
    await Resource.findByIdAndUpdate(ingredient.resource, {
      $inc: { currentStock: -ingredient.quantity },
    });
  }
};

module.exports = mongoose.model("MenuItem", menuItemSchema);
