import Menu1 from "../assets/menu-1.jpg";
import Menu2 from "../assets/menu-2.jpg";
import Menu3 from "../assets/menu-3.jpg";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const MenuItem = ({ image, price, name, description }) => (
  <div className="flex items-start mb-8">
    <div className="relative">
      <img
        className="w-20 h-20 rounded-full object-cover"
        src={image}
        alt={name}
      />
      <div className="absolute -top-2 -right-2 bg-primary w-10 h-10 rounded-full flex items-center justify-center text-white font-bold">
        ${price}
      </div>
    </div>
    <div className="flex-1 pl-4">
      <h4 className="text-xl font-bold text-dark mb-2">{name}</h4>
      <p className="text-coffee">{description}</p>
    </div>
  </div>
);

const Menu = () => {
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

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.3,
      },
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

  const menuItems = {
    hot: [
      {
        image: Menu1,
        price: "5",
        name: "Black Coffee",
        description:
          "Sit lorem ipsum et diam elitr est dolor sed duo guberg sea et et lorem dolor",
      },
      {
        image: Menu2,
        price: "7",
        name: "Chocolete Coffee",
        description:
          "Sit lorem ipsum et diam elitr est dolor sed duo guberg sea et et lorem dolor",
      },
      {
        image: Menu3,
        price: "9",
        name: "Coffee With Milk",
        description:
          "Sit lorem ipsum et diam elitr est dolor sed duo guberg sea et et lorem dolor",
      },
    ],
    cold: [
      {
        image: Menu1,
        price: "5",
        name: "Black Coffee",
        description:
          "Sit lorem ipsum et diam elitr est dolor sed duo guberg sea et et lorem dolor",
      },
      {
        image: Menu2,
        price: "7",
        name: "Chocolete Coffee",
        description:
          "Sit lorem ipsum et diam elitr est dolor sed duo guberg sea et et lorem dolor",
      },
      {
        image: Menu3,
        price: "9",
        name: "Coffee With Milk",
        description:
          "Sit lorem ipsum et diam elitr est dolor sed duo guberg sea et et lorem dolor",
      },
    ],
  };

  return (
    <motion.div
      className="container mx-auto px-10 "
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <motion.div className="text-center section-title" variants={itemVariants}>
        <h4 className="text-primary uppercase tracking-[5px]">
          MENU & PRICING
        </h4>
        <h1 className="text-4xl font-bold text-dark">Competitive Pricing</h1>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-dark mb-8">Hot Coffee</h1>
          {menuItems.hot.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <MenuItem {...item} />
            </motion.div>
          ))}
        </motion.div>
        <motion.div variants={itemVariants}>
          <h1 className="text-3xl font-bold text-dark mb-8">Cold Coffee</h1>
          {menuItems.cold.map((item, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ x: 10 }}
              transition={{ duration: 0.2 }}
            >
              <MenuItem {...item} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Menu;
