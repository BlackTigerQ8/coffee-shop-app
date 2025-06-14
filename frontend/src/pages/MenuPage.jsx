import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button, IconButton, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CustomCard from "../components/Card";
import CardImg from "../assets/card.jpg";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenuItems } from "../redux/menuSlice";
import Backdrop from "../components/Backdrop";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
const MenuPage = ({ cart, setCart }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const API_URL = import.meta.env.VITE_API_URL;

  const { menuItems = [], status, error } = useSelector((state) => state.menu);
  const isLoading = status === "loading";
  const { userInfo } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMenuItems());
  }, [dispatch]);

  // Group items by category
  const groupedItems = menuItems?.reduce((acc, item) => {
    // Safely access category name, fallback to "Other" if category is undefined
    const categoryName = item?.category?.name || "Other";
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(item);
    return acc;
  }, {});

  const containerVariants = {
    hidden: {
      opacity: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren",
      },
    },
  };

  const categoryVariants = {
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

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCart(
      cart
        .map((item) =>
          item.id === itemId && item.quantity > 0
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getItemQuantity = (itemId) => {
    const item = cart.find((item) => item.id === itemId);
    return item ? item.quantity : 0;
  };

  if (error) {
    return <Alert severity="error">Error: {error}</Alert>;
  }

  return (
    <div ref={ref}>
      <Backdrop isOpen={isLoading} />
      <Header
        title="Our Menu"
        subtitle="Choose your favorite drink and enjoy the best coffee in town"
      />
      <motion.div
        className="flex flex-col items-end w-full p-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {(userInfo?.role === "Admin" || userInfo?.role === "Barista") && (
          <Button
            onClick={() => navigate("/menu/dashboard")}
            sx={{
              backgroundColor: "#DA9F5B",
              "&:hover": {
                backgroundColor: "#c48f51",
              },
              color: "white",
              fontWeight: "bold",
              textTransform: "uppercase",
              fontSize: "1rem",
              padding: "0.5rem 1rem",
              borderRadius: "0.5rem",
            }}
          >
            Manage Menu
          </Button>
        )}
      </motion.div>
      <motion.div
        className="flex flex-col items-center w-full p-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {Object.entries(groupedItems).map(([category, items]) => (
          <motion.div
            key={category}
            className="w-full max-w-7xl mb-12"
            variants={categoryVariants}
          >
            <motion.h2
              className="text-3xl font-bold mb-6 text-center"
              variants={categoryVariants}
            >
              {category}
            </motion.h2>
            <motion.div
              className="flex flex-wrap gap-6 justify-center"
              variants={containerVariants}
            >
              {items.length > 0 ? (
                items.map((item) => (
                  <motion.div
                    key={item._id}
                    variants={cardVariants}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <CustomCard>
                      <img
                        src={`${API_URL}/${item.image}`}
                        alt={item.name}
                        crossOrigin="anonymous"
                        onError={(e) => {
                          console.error("Failed to load image:", e.target.src);
                          e.target.onerror = null;
                          e.target.src = CardImg;
                        }}
                        className="w-full h-40 object-cover"
                      />
                      <div className="px-4 mt-3">
                        <h1 className="text-xl font-semibold">{item.name}</h1>
                        <p className="mb-2">{item.description}</p>
                        <p className="mb-2">${item.price.toFixed(2)}</p>
                        <div className="flex items-center gap-2 justify-between">
                          <Button
                            variant="contained"
                            size="small"
                            disabled={getItemQuantity(item.id) === 0}
                            onClick={() => {
                              const qty = getItemQuantity(item.id);
                              for (let i = 0; i < qty; i++) {
                                addToCart(item);
                              }
                            }}
                            sx={{
                              backgroundColor: "#6F4E37",
                              "&:hover": {
                                backgroundColor: "#5C4132",
                              },
                              minWidth: "auto",
                              px: 2,
                            }}
                          >
                            Add
                          </Button>
                          <div className="flex justify-end items-center gap-1">
                            <IconButton
                              size="small"
                              onClick={() => removeFromCart(item.id)}
                              disabled={getItemQuantity(item.id) === 0}
                            >
                              <RemoveIcon />
                            </IconButton>
                            <span className="w-8 text-center">
                              {getItemQuantity(item.id)}
                            </span>
                            <IconButton
                              size="small"
                              onClick={() => addToCart(item)}
                            >
                              <AddIcon />
                            </IconButton>
                          </div>
                        </div>
                      </div>
                    </CustomCard>
                  </motion.div>
                ))
              ) : (
                <Alert severity="error">
                  <h2 className="text-2xl text-secondary mb-4">
                    {t("no_menu_items_available")}
                  </h2>
                </Alert>
              )}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default MenuPage;
