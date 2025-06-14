const Resource = require("../models/resourceModel");
const Category = require("../models/categoryModel");

// Get all resources
const getResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate("category");
    res.status(200).json({
      status: "Success",
      data: { resources },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// Get resources by category
const getResourcesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const resources = await Resource.find({ category: categoryId }).populate(
      "category"
    );
    res.status(200).json({
      status: "Success",
      data: { resources },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// Create new resource
const createResource = async (req, res) => {
  try {
    const resource = new Resource(req.body);
    await resource.save();
    await resource.populate("category");

    res.status(201).json({
      status: "Success",
      data: { resource },
    });
  } catch (error) {
    res.status(400).json({
      status: "Error",
      message: error.message,
    });
  }
};

// Update resource
const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate("category");

    if (!resource) {
      return res.status(404).json({
        status: "Error",
        message: "Resource not found",
      });
    }

    res.status(200).json({
      status: "Success",
      data: { resource },
    });
  } catch (error) {
    res.status(400).json({
      status: "Error",
      message: error.message,
    });
  }
};

// Delete resource
const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findByIdAndDelete(id);

    if (!resource) {
      return res.status(404).json({
        status: "Error",
        message: "Resource not found",
      });
    }

    res.status(200).json({
      status: "Success",
      message: "Resource deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// Restock resource
const restockResource = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    const resource = await Resource.findByIdAndUpdate(
      id,
      {
        $inc: { currentStock: quantity },
        lastRestocked: Date.now(),
        updatedAt: Date.now(),
      },
      { new: true }
    ).populate("category");

    if (!resource) {
      return res.status(404).json({
        status: "Error",
        message: "Resource not found",
      });
    }

    res.status(200).json({
      status: "Success",
      data: { resource },
      message: `Added ${quantity} ${resource.unit} to ${resource.name}`,
    });
  } catch (error) {
    res.status(400).json({
      status: "Error",
      message: error.message,
    });
  }
};

// Get low stock resources
const getLowStockResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate("category");
    const lowStockResources = resources.filter(
      (resource) => resource.currentStock <= resource.minimumStock
    );

    res.status(200).json({
      status: "Success",
      data: { resources: lowStockResources },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// Get resources for a specific menu category (for ingredient selection)
const getResourcesForMenuCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Get resources that are commonly used for this menu category
    // This could be enhanced with a mapping system later
    const resources = await Resource.find({ category: categoryId }).populate(
      "category"
    );

    res.status(200).json({
      status: "Success",
      data: { resources },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

module.exports = {
  getResources,
  getResourcesByCategory,
  createResource,
  updateResource,
  deleteResource,
  restockResource,
  getLowStockResources,
  getResourcesForMenuCategory,
};
