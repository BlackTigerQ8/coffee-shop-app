import Service1 from "../assets/service-1.jpg";
import Service2 from "../assets/service-2.jpg";
import Service3 from "../assets/service-3.jpg";
import Service4 from "../assets/service-4.jpg";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const ServiceItem = ({ image, icon, title, description, variants }) => (
  <motion.div className="lg:w-1/2 mb-12 px-4" variants={variants}>
    <motion.div
      className="flex flex-col md:flex-row items-start"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="md:w-1/3 mb-6 md:mb-0">
        <motion.img
          className="w-full rounded"
          src={image}
          alt={title}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className="md:w-2/3 md:pl-8">
        <h4 className="flex items-center text-xl font-bold mb-3">
          <motion.div
            className="bg-primary w-12 h-12 rounded-full flex items-center justify-center text-white mr-3"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <i className={icon}></i>
          </motion.div>
          {title}
        </h4>
        <p className="text-coffee">{description}</p>
      </div>
    </motion.div>
  </motion.div>
);

const Services = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const titleVariants = {
    hidden: {
      opacity: 0,
      y: -20,
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

  const itemVariants = {
    hidden: {
      opacity: 0,
      x: -30,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const services = [
    {
      image: Service1,
      icon: "fa fa-truck",
      title: "Fastest Door Delivery",
      description:
        "Sit lorem ipsum et diam elitr est dolor sed duo. Guberg sea et et lorem dolor sed est sit invidunt, dolore tempor diam ipsum takima erat tempor",
    },
    {
      image: Service2,
      icon: "fa fa-coffee",
      title: "Fresh Coffee Beans",
      description:
        "Sit lorem ipsum et diam elitr est dolor sed duo. Guberg sea et et lorem dolor sed est sit invidunt, dolore tempor diam ipsum takima erat tempor",
    },
    {
      image: Service3,
      icon: "fa fa-award",
      title: "Best Quality Coffee",
      description:
        "Sit lorem ipsum et diam elitr est dolor sed duo. Guberg sea et et lorem dolor sed est sit invidunt, dolore tempor diam ipsum takima erat tempor",
    },
    {
      image: Service4,
      icon: "fa fa-table",
      title: "Online Table Booking",
      description:
        "Sit lorem ipsum et diam elitr est dolor sed duo. Guberg sea et et lorem dolor sed est sit invidunt, dolore tempor diam ipsum takima erat tempor",
    },
  ];

  return (
    <div className="py-20 bg-light" ref={ref}>
      <motion.div
        className="container mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <motion.div
          className="text-center mb-16 section-title"
          variants={titleVariants}
        >
          <h4 className="text-primary uppercase tracking-[5px] mb-2">
            OUR SERVICES
          </h4>
          <h1 className="text-4xl font-bold text-dark">
            Fresh & Organic Beans
          </h1>
        </motion.div>

        <motion.div className="flex flex-wrap">
          {services.map((service, index) => (
            <ServiceItem key={index} {...service} variants={itemVariants} />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Services;
