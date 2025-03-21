const express = require("express");
const {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItem,
} = require("../controllers/menuController");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const { menuImageUpload } = require("./uploadRoutes");

const router = express.Router();

// Public routes
router.get("/", getAllMenuItems);

// Protected routes (Admin/Barista only)
router.use(protect);
router.use(restrictTo("Admin", "Barista"));

router.post("/", menuImageUpload.single("image"), createMenuItem);
router
  .route("/:id")
  .get(getMenuItem)
  .put(menuImageUpload.single("image"), updateMenuItem)
  .delete(deleteMenuItem);

module.exports = router;
