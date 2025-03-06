import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const Header = ({ title, subtitle }) => {
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

  return (
    <motion.div
      ref={ref}
      className="relative  py-5 text-center bg-secondary text-white overlay-bottom offer"
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      <div className="container mx-auto pt-20">
        <motion.h1
          className="text-primary text-6xl mt-3 uppercase"
          variants={itemVariants}
        >
          {title}
        </motion.h1>

        {/* <motion.h1 className="text-4xl mb-3 text-white" variants={itemVariants}>
          A touch of class
        </motion.h1> */}

        <motion.h4
          className="font-normal mb-12 text-white"
          variants={itemVariants}
        >
          {subtitle}
        </motion.h4>
      </div>
    </motion.div>
  );
};

export default Header;
