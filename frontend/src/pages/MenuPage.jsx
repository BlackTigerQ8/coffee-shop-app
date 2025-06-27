import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import { useInView } from "framer-motion";
import { motion } from "framer-motion";
import { useRef } from "react";
import {
  Button,
  IconButton,
  Alert,
  Typography,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
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
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { menuItems = [], status, error } = useSelector((state) => state.menu);
  const isLoading = status === "loading";
  const { userInfo } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMenuItems());
  }, [dispatch]);

  // Get unique categories from menu items
  const categories = [
    "All",
    ...new Set(menuItems.map((item) => item?.category?.name || "Other")),
  ];

  // Filter items based on selected category
  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter(
          (item) => (item?.category?.name || "Other") === selectedCategory
        );

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

  // Render menu item card
  const renderMenuItem = (item) => (
    <motion.div
      key={item._id}
      variants={cardVariants}
      whileHover={{ scale: item.isAvailable ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
      style={{
        opacity: item.isAvailable ? 1 : 0.6,
        position: "relative",
      }}
    >
      <CustomCard>
        {!item.isAvailable && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                backgroundColor: "rgba(0,0,0,0.7)",
                color: "white",
                padding: "8px 16px",
                borderRadius: "4px",
              }}
            >
              {t("currently_unavailable")}
            </Typography>
          </div>
        )}
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
          <p className="mb-2">{item.price.toFixed(3)}KWD</p>
          <div className="flex items-center gap-2 justify-between">
            <Button
              variant="contained"
              size="small"
              disabled={getItemQuantity(item.id) === 0 || !item.isAvailable}
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
                disabled={getItemQuantity(item.id) === 0 || !item.isAvailable}
              >
                <RemoveIcon />
              </IconButton>
              <span className="w-8 text-center">
                {getItemQuantity(item.id)}
              </span>
              <IconButton
                size="small"
                onClick={() => addToCart(item)}
                disabled={!item.isAvailable}
              >
                <AddIcon />
              </IconButton>
            </div>
          </div>
        </div>
      </CustomCard>
    </motion.div>
  );

  return (
    <div ref={ref}>
      <Backdrop isOpen={isLoading} />
      <Header title={t("our_menu")} subtitle={t("our_menu_subtitle")} />

      {/* Category Filter Buttons */}
      <motion.div
        className="flex flex-col items-center w-full px-8 mt-10"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: 1,
            mb: 4,
            width: "100%",
            maxWidth: "100%",
          }}
        >
          {/* Mobile Select Dropdown */}
          <Box sx={{ display: { xs: "flex", md: "none" }, width: "100%" }}>
            <FormControl
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#DA9F5B" },
                  "&:hover fieldset": { borderColor: "#c48f51" },
                  "&.Mui-focused fieldset": {
                    borderColor: "#DA9F5B",
                  },
                },
                "& .MuiInputLabel-root": {
                  color: "#DA9F5B",
                  "&.Mui-focused": {
                    color: "#DA9F5B",
                  },
                },
              }}
            >
              <InputLabel>{t("filter_by_category")}</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label={t("filter_by_category")}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Desktop Buttons */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 1,
            }}
          >
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                sx={{
                  backgroundColor:
                    selectedCategory === category ? "#6F4E37" : "#DA9F5B",
                  color: "white",
                  "&:hover": {
                    backgroundColor:
                      selectedCategory === category ? "#5C4132" : "#c48f51",
                  },
                  margin: "0.5rem",
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  width: "12rem",
                  height: "4rem",
                }}
              >
                {category}
              </Button>
            ))}
          </Box>
        </Box>
      </motion.div>

      {/* Menu Items */}
      <motion.div
        className="flex flex-col items-center w-full p-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {selectedCategory === "All" ? (
          // Show all categories when "All" is selected
          Object.entries(
            filteredItems.reduce((acc, item) => {
              const categoryName = item?.category?.name || "Other";
              if (!acc[categoryName]) {
                acc[categoryName] = [];
              }
              acc[categoryName].push(item);
              return acc;
            }, {})
          ).map(([category, items]) => (
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
                {items.map(renderMenuItem)}
              </motion.div>
            </motion.div>
          ))
        ) : (
          // Show only the selected category's items
          <motion.div
            className="w-full max-w-7xl mb-12"
            variants={categoryVariants}
          >
            <motion.div
              className="flex flex-wrap gap-6 justify-center"
              variants={containerVariants}
            >
              {filteredItems.map(renderMenuItem)}
            </motion.div>
          </motion.div>
        )}
      </motion.div>

      <Footer />
      <BackToTop />
    </div>
  );
};

export default MenuPage;
