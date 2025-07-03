import React, { useEffect } from "react";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import {
  IconButton,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  updateCartItem,
  removeFromCart,
  addToCart,
} from "../redux/cartSlice";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";
import Backdrop from "../components/Backdrop";
import CardImg from "../assets/card.jpg";

const CartPage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const API_URL = import.meta.env.VITE_API_URL;

  const {
    items: cartItems = [],
    totalAmount,
    status,
    error,
  } = useSelector((state) => state.cart);
  const { userInfo, token } = useSelector((state) => state.user);

  const isLoading = status === "loading";
  const isAuthenticated = !!(userInfo && token);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    dispatch(fetchCart());
  }, [dispatch, isAuthenticated, navigate]);

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const updateQuantity = (menuItemId, newQuantity) => {
    if (newQuantity === 0) {
      dispatch(removeFromCart(menuItemId));
    } else {
      dispatch(updateCartItem({ menuItemId, quantity: newQuantity }));
    }
  };

  const handleRemoveItem = (menuItemId) => {
    dispatch(removeFromCart(menuItemId));
  };

  const handleAddOne = (menuItemId) => {
    dispatch(addToCart({ menuItemId, quantity: 1 }));
  };

  if (!isAuthenticated) {
    return null; // This will redirect in useEffect
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title={t("cart")} subtitle={t("cart_subtitle")} />
        <div className="flex-grow container mx-auto px-4 py-8">
          <Alert severity="error">Error: {error}</Alert>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div ref={ref} className="flex flex-col min-h-screen">
      <Backdrop isOpen={isLoading} />
      <Header title={t("cart")} subtitle={t("cart_subtitle")} />
      <motion.div
        className="flex-grow container mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-2xl text-secondary mb-4">{t("cart_empty")}</h2>
            <Button
              variant="contained"
              onClick={() => navigate("/menu")}
              sx={{
                backgroundColor: "#DA9F5B",
                "&:hover": {
                  backgroundColor: "#c48f51",
                },
              }}
            >
              {t("return_to_menu")}
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
            {/* Desktop View */}
            <div className="hidden md:block">
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>{t("item")}</TableCell>
                      <TableCell align="right">{t("price")}</TableCell>
                      <TableCell align="center">{t("quantity")}</TableCell>
                      <TableCell align="right">{t("subtotal")}</TableCell>
                      <TableCell align="center">{t("actions")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cartItems.map((item) => (
                      <TableRow key={item._id}>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <img
                              src={`${API_URL}/${item.menuItem.image}`}
                              alt={item.menuItem.name}
                              crossOrigin="anonymous"
                              onError={(e) => {
                                console.error(
                                  "Failed to load image:",
                                  e.target.src
                                );
                                e.target.onerror = null;
                                e.target.src = CardImg;
                              }}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <span className="font-semibold">
                              {item.menuItem.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          {item.price.toFixed(3)}KWD
                        </TableCell>
                        <TableCell align="center">
                          <div className="flex items-center justify-center gap-2">
                            <IconButton
                              size="small"
                              onClick={() =>
                                updateQuantity(
                                  item.menuItem._id,
                                  item.quantity - 1
                                )
                              }
                            >
                              <RemoveIcon />
                            </IconButton>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <IconButton
                              size="small"
                              onClick={() => handleAddOne(item.menuItem._id)}
                            >
                              <AddIcon />
                            </IconButton>
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          {(item.price * item.quantity).toFixed(3)}KWD
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveItem(item.menuItem._id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} align="right">
                        <span className="text-xl font-bold">{t("total")}:</span>
                      </TableCell>
                      <TableCell align="right">
                        <span className="text-xl font-bold">
                          {totalAmount.toFixed(3)}KWD
                        </span>
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>

            {/* Mobile View */}
            <div className="md:hidden space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <img
                      src={`${API_URL}/${item.menuItem.image}`}
                      alt={item.menuItem.name}
                      crossOrigin="anonymous"
                      onError={(e) => {
                        console.error("Failed to load image:", e.target.src);
                        e.target.onerror = null;
                        e.target.src = CardImg;
                      }}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg">
                        {item.menuItem.name}
                      </h3>
                      <p className="text-gray-600">
                        {item.price.toFixed(3)}KWD
                      </p>
                    </div>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveItem(item.menuItem._id)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.menuItem._id, item.quantity - 1)
                        }
                      >
                        <RemoveIcon />
                      </IconButton>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <IconButton
                        size="small"
                        onClick={() => handleAddOne(item.menuItem._id)}
                      >
                        <AddIcon />
                      </IconButton>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{t("subtotal")}</p>
                      <p className="font-semibold">
                        {(item.price * item.quantity).toFixed(3)}KWD
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Mobile Total */}
              <div className="pt-4 mt-4">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-bold">{t("total")}:</span>
                  <span className="text-xl font-bold">
                    {totalAmount.toFixed(3)}KWD
                  </span>
                </div>
              </div>
            </div>

            {/* Buttons - Same for both views */}
            <div className="mt-6 flex justify-end gap-4">
              <Button
                variant="outlined"
                onClick={() => navigate("/menu")}
                sx={{
                  borderColor: "#DA9F5B",
                  color: "#DA9F5B",
                  "&:hover": {
                    borderColor: "#c48f51",
                    backgroundColor: "rgba(218, 159, 91, 0.04)",
                  },
                }}
              >
                {t("continue_shopping")}
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/checkout")}
                sx={{
                  backgroundColor: "#DA9F5B",
                  "&:hover": {
                    backgroundColor: "#c48f51",
                  },
                }}
              >
                {t("proceed_to_checkout")}
              </Button>
            </div>
          </div>
        )}
      </motion.div>
      <div className="mt-auto">
        <Footer />
      </div>
      <BackToTop />
    </div>
  );
};

export default CartPage;
