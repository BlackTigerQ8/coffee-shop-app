const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Resource name is required"],
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category is required"],
  },
  unit: {
    type: String,
    required: [true, "Unit is required"],
    enum: ["ml", "g", "kg", "l", "pieces", "shots", "cups", "oz"],
  },
  currentStock: {
    type: Number,
    required: [true, "Current stock is required"],
    min: [0, "Stock cannot be negative"],
    default: 0,
  },
  minimumStock: {
    type: Number,
    required: [true, "Minimum stock is required"],
    min: [0, "Minimum stock cannot be negative"],
    default: 0,
  },
  costPerUnit: {
    type: Number,
    required: [true, "Cost per unit is required"],
    min: [0, "Cost cannot be negative"],
  },
  supplier: {
    type: String,
    trim: true,
  },
  lastRestocked: {
    type: Date,
    default: Date.now,
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

// Virtual for low stock alert
resourceSchema.virtual("isLowStock").get(function () {
  return this.currentStock <= this.minimumStock;
});

// Index for better performance
resourceSchema.index({ category: 1 });
resourceSchema.index({ currentStock: 1, minimumStock: 1 });

module.exports = mongoose.model("Resource", resourceSchema);
