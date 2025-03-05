import { useState, useEffect } from "react";

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
      className={`fixed right-6 bottom-6 z-50 p-4 bg-primary text-white rounded-lg shadow-lg transition-opacity duration-300 hover:bg-opacity-90 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <i className="fa fa-angle-double-up text-lg"></i>
    </button>
  );
};

export default BackToTop;
