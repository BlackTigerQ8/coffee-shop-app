import AboutImg from "../assets/about.png";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { BsCheckLg } from "react-icons/bs";

const About = () => {
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

  const itemVariants = {
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

  const imageVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="py-16" id="about" ref={ref}>
      <motion.div
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {/* Section Title */}
        <motion.div className="text-center mb-16" variants={itemVariants}>
          <h4 className="text-primary uppercase tracking-[5px]">About Us</h4>
          <h1 className="text-4xl font-bold">Serving Since 1950</h1>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Our Story */}
          <motion.div className="lg:w-1/3 space-y-4" variants={itemVariants}>
            <h1 className="text-2xl font-bold">Our Story</h1>
            <h5 className="text-lg font-medium">
              Eos kasd eos dolor vero vero, lorem stet diam rebum. Ipsum amet
              sed vero dolor sea
            </h5>
            <p>
              Takimata sed vero vero no sit sed, justo clita duo no duo amet et,
              nonumy kasd sed dolor eos diam lorem eirmod. Amet sit amet amet
              no. Est nonumy sed labore eirmod sit magna. Erat at est justo sit
              ut. Labor diam sed ipsum et eirmod
            </p>
            <motion.a
              href=""
              className="inline-block bg-secondary text-white font-bold py-2 px-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.a>
          </motion.div>

          {/* Image */}
          <motion.div
            className="lg:w-1/3 min-h-[500px] relative"
            variants={imageVariants}
          >
            <motion.img
              className="w-full h-full object-cover"
              src={AboutImg}
              alt="About"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </motion.div>

          {/* Our Vision */}
          <motion.div className="lg:w-1/3 space-y-4" variants={itemVariants}>
            <h1 className="text-2xl font-bold">Our Vision</h1>
            <p>
              Invidunt lorem justo sanctus clita. Erat lorem labore ea, justo
              dolor lorem ipsum ut sed eos, ipsum et dolor kasd sit ea justo.
              Erat justo sed sed diam. Ea et erat ut sed diam sea ipsum est
              dolor
            </p>
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <motion.div
                  key={item}
                  className="flex items-center gap-3"
                  variants={itemVariants}
                  whileHover={{ x: 10 }}
                >
                  <BsCheckLg className="text-primary text-xl" />
                  <span>Lorem ipsum dolor sit amet</span>
                </motion.div>
              ))}
            </div>
            <motion.a
              href=""
              className="inline-block bg-primary text-white font-bold py-2 px-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Learn More
            </motion.a>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default About;
