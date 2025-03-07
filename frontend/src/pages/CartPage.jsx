import React from "react";
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
} from "@mui/material";
import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";

const CartPage = ({ cart, setCart }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });
  const navigate = useNavigate();
  const { t } = useTranslation();

  CartPage.defaultProps = {
    cart: [],
    setCart: () => {},
  };

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

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity === 0) {
      setCart(cart.filter((item) => item.id !== itemId));
    } else {
      setCart(
        cart.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div ref={ref} className="flex flex-col min-h-screen">
      <Header title={t("cart")} subtitle={t("cart_subtitle")} />
      <motion.div
        className="flex-grow container mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {cart.length === 0 ? (
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
                    {cart.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="flex items-center gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                            <span className="font-semibold">{item.name}</span>
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          ${item.price.toFixed(2)}
                        </TableCell>
                        <TableCell align="center">
                          <div className="flex items-center justify-center gap-2">
                            <IconButton
                              size="small"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <RemoveIcon />
                            </IconButton>
                            <span className="w-8 text-center">
                              {item.quantity}
                            </span>
                            <IconButton
                              size="small"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <AddIcon />
                            </IconButton>
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          ${(item.price * item.quantity).toFixed(2)}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            color="error"
                            onClick={() => updateQuantity(item.id, 0)}
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
                          ${calculateTotal().toFixed(2)}
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
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-gray-200 pb-4 last:border-b-0"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-600">${item.price.toFixed(2)}</p>
                    </div>
                    <IconButton
                      color="error"
                      onClick={() => updateQuantity(item.id, 0)}
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
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <RemoveIcon />
                      </IconButton>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <IconButton
                        size="small"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        <AddIcon />
                      </IconButton>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{t("subtotal")}</p>
                      <p className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
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
                    ${calculateTotal().toFixed(2)}
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
