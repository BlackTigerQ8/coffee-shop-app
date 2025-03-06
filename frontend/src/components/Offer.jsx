import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const Offer = () => {
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

  const formVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.3,
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      className="relative my-20 py-20 text-center bg-secondary text-white overlay-top overlay-bottom offer"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="container mx-auto py-20">
        <motion.h1
          className="text-primary text-6xl mt-3"
          variants={itemVariants}
        >
          50% OFF
        </motion.h1>

        <motion.h1 className="text-4xl mb-3 text-white" variants={itemVariants}>
          Sunday Special Offer
        </motion.h1>

        <motion.h4
          className="font-normal mb-12 text-white"
          variants={itemVariants}
        >
          Only for Sunday from 1st Jan to 30th Jan 2045
        </motion.h4>

        <motion.form
          className="flex justify-center mb-4"
          variants={formVariants}
        >
          <motion.div
            className="flex max-w-md w-full"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.input
              type="text"
              className="flex-1 p-4 bg-white text-gray-900 focus:outline-none"
              placeholder="Your Email"
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            />
            <motion.button
              className="btn-primary whitespace-nowrap"
              type="submit"
              whileHover={{ scale: 1.05, backgroundColor: "#da9f5b" }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              Sign Up
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default Offer;
