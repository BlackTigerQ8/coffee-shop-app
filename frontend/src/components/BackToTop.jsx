import { useState, useEffect } from "react";
import { FaChevronUp } from "react-icons/fa";

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-8 right-8 w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-secondary transition-colors duration-300 animate-bounce ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <FaChevronUp className="text-white text-xl" />
    </button>
  );
};

export default BackToTop;
