const express = require("express");
const {
  getResources,
  getResourcesByCategory,
  createResource,
  updateResource,
  deleteResource,
  restockResource,
  getLowStockResources,
  getResourcesForMenuCategory,
} = require("../controllers/resourceController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes (for checking availability)
router.get("/", getResources);
router.get("/low-stock", getLowStockResources);
router.get("/category/:categoryId", getResourcesByCategory);
router.get("/menu-category/:categoryId", getResourcesForMenuCategory);

// Protected routes (Admin and Barista only)
router.use(protect);
router.use(restrictTo("Admin", "Barista"));

router.post("/", createResource);
router.put("/:id", updateResource);
router.delete("/:id", deleteResource);
router.patch("/:id/restock", restockResource);

module.exports = router;
