const express = require("express");
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getAllCategories);

// Protected routes (Admin only)
router.use(protect);
router.use(restrictTo("Admin"));

router.post("/", createCategory);
router.route("/:id").put(updateCategory).delete(deleteCategory);

module.exports = router;
