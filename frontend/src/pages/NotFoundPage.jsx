import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CoffeeImage from "../assets/imagem-cafe1.png";

const NotFoundPage = () => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-[#EAEAEA] overflow-hidden pt-20 relative font-['Karla']"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Coffee Image */}
      <motion.img
        src={CoffeeImage}
        alt="Coffee"
        className="w-[650px] h-[650px] absolute left-[290px]"
        variants={itemVariants}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      />

      {/* Error Message */}
      <motion.div
        className="absolute top-[450px] left-[700px] w-[500px]"
        variants={itemVariants}
      >
        <motion.h3
          className="text-[25px] font-normal text-black tracking-[-0.32px] mb-2"
          variants={itemVariants}
        >
          Oops!
        </motion.h3>
        <motion.p className="text-black font-light" variants={itemVariants}>
          {t("pageNotFoundMessage")}
        </motion.p>
      </motion.div>

      {/* Back Button */}
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Link to="/">
          <button
            className="w-[140px] h-[60px] rounded-[30px] bg-[#11100D] text-white text-[20px] 
            font-normal tracking-[-0.2px] absolute top-[500px] left-[180px] 
            shadow-[4px_4px_4px_0px_rgba(0,0,0,0.25)] transition-all duration-300
            hover:bg-[#2c2b27]"
          >
            {t("backToHome")}
          </button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default NotFoundPage;
