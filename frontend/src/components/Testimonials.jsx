import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Testimonial1 from "../assets/testimonial-1.jpg";
import Testimonial2 from "../assets/testimonial-2.jpg";
import Testimonial3 from "../assets/testimonial-3.jpg";
import Testimonial4 from "../assets/testimonial-4.jpg";

const TestimonialCard = ({ image, name, profession, text, isActive }) => (
  <motion.div
    className={`w-full px-4 transition-opacity duration-500 ${
      isActive ? "opacity-100" : "opacity-40"
    }`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: isActive ? 1 : 0.4, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="flex flex-col  items-start text-left">
      <div className="flex flex-row items-center">
        <img src={image} alt={name} className="w-24 h-24 object-cover mb-4" />
        <div className="flex flex-col items-start ml-4">
          <h4 className="text-xl font-bold text-dark">{name}</h4>
          <p className="text-primary italic mb-4">{profession}</p>
        </div>
      </div>
      <p className="text-coffee max-w-md mx-auto">{text}</p>
    </div>
  </motion.div>
);

const Testimonials = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const testimonials = [
    {
      image: Testimonial1,
      name: "Client Name",
      profession: "Profession",
      text: "Sed ea amet kasd elitr stet, stet rebum et ipsum est duo elitr eirmod clita lorem. Dolor tempor ipsum sanct clita",
    },
    {
      image: Testimonial2,
      name: "Client Name",
      profession: "Profession",
      text: "Sed ea amet kasd elitr stet, stet rebum et ipsum est duo elitr eirmod clita lorem. Dolor tempor ipsum sanct clita",
    },
    {
      image: Testimonial3,
      name: "Client Name",
      profession: "Profession",
      text: "Sed ea amet kasd elitr stet, stet rebum et ipsum est duo elitr eirmod clita lorem. Dolor tempor ipsum sanct clita",
    },
    {
      image: Testimonial4,
      name: "Client Name",
      profession: "Profession",
      text: "Sed ea amet kasd elitr stet, stet rebum et ipsum est duo elitr eirmod clita lorem. Dolor tempor ipsum sanct clita",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container mx-auto">
      <div className="text-center section-title">
        <h4 className="text-primary uppercase tracking-[5px] mb-3">
          TESTIMONIAL
        </h4>
        <h1 className="text-4xl font-bold text-dark">Our Clients Say</h1>
      </div>

      <div className="relative px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              {...testimonial}
              isActive={index === activeSlide}
            />
          ))}
        </div>

        <div className="flex justify-center mt-12 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`transition-all duration-300 ${
                index === activeSlide
                  ? "w-8 h-3 bg-primary"
                  : "w-3 h-3 bg-gray-300"
              } rounded-full`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
