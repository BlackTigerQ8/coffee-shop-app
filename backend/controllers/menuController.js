const MenuItem = require("../models/menuModel");

// @desc    Get all menu items
// @route   GET /api/menu
// @access  Public
const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({ category: 1 });
    res.status(200).json({
      status: "Success",
      data: {
        items: menuItems,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// @desc    Create new menu item
// @route   POST /api/menu
// @access  Private (Admin/Barista)
const createMenuItem = async (req, res) => {
  try {
    const uploadedFile = req.file;
    const filePath = uploadedFile ? uploadedFile.path : null;

    if (!filePath) {
      return res.status(400).json({
        status: "Error",
        message: "Image is required",
      });
    }

    const menuItem = await MenuItem.create({
      name: req.body.name,
      price: req.body.price,
      category: req.body.category,
      description: req.body.description,
      image: filePath,
    });

    res.status(201).json({
      status: "Success",
      data: {
        item: menuItem,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// @desc    Update menu item
// @route   PUT /api/menu/:id
// @access  Private (Admin/Barista)
const updateMenuItem = async (req, res) => {
  try {
    const updateData = req.file
      ? { ...req.body, image: req.file.path }
      : { ...req.body };

    const menuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      { ...updateData, updatedAt: Date.now() },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!menuItem) {
      return res.status(404).json({
        status: "Error",
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      status: "Success",
      data: {
        item: menuItem,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menu/:id
// @access  Private (Admin/Barista)
const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findByIdAndDelete(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        status: "Error",
        message: "Menu item not found",
      });
    }

    res.status(204).json({
      status: "Success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "Error",
      message: error.message,
    });
  }
};

module.exports = {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
};
