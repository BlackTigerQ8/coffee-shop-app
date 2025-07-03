const express = require("express");
const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// All cart routes require authentication
router.use(protect);

// Cart routes for customers
router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/remove/:menuItemId", removeFromCart);
router.delete("/clear", clearCart);

module.exports = router;
