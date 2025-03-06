import React, { useState } from "react";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Button, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CustomCard from "../components/Card";
import CardImg from "../assets/card.jpg";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";

const menuItems = {
  "Hot Drinks": [
    { id: 1, name: "Espresso", price: 3.5, image: CardImg },
    { id: 2, name: "Cappuccino", price: 4.5, image: CardImg },
    { id: 3, name: "Latte", price: 4.0, image: CardImg },
  ],
  "Cold Drinks": [
    { id: 4, name: "Iced Coffee", price: 4.0, image: CardImg },
    { id: 5, name: "Frappuccino", price: 5.5, image: CardImg },
    { id: 6, name: "Cold Brew", price: 4.5, image: CardImg },
  ],
  Snacks: [
    { id: 7, name: "Croissant", price: 3.0, image: CardImg },
    { id: 8, name: "Muffin", price: 2.5, image: CardImg },
    { id: 9, name: "Cookie", price: 2.0, image: CardImg },
  ],
  Food: [
    { id: 10, name: "Sandwich", price: 8.0, image: CardImg },
    { id: 11, name: "Salad", price: 9.0, image: CardImg },
    { id: 12, name: "Quiche", price: 7.5, image: CardImg },
  ],
};

const MenuPage = ({ cart, setCart }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

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

  return (
    <div ref={ref}>
      <Header
        title="Our Menu"
        subtitle="Choose your favorite drink and enjoy the best coffee in town"
      />
      <motion.div
        className="flex flex-col items-center w-full p-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {Object.entries(menuItems).map(([category, items]) => (
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
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  variants={cardVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <CustomCard>
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="px-4 mt-3">
                      <h1 className="text-xl font-semibold">{item.name}</h1>
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
              ))}
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
