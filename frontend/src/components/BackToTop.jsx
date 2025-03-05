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
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault();
        scrollToTop();
      }}
      className={`back-to-top btn-lg btn-primary ${isVisible ? "show" : ""}`}
    >
      <i className="fa fa-angle-double-up"></i>
    </a>
  );
};

export default BackToTop;
