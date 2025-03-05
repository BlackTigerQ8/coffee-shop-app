import { useState, useEffect } from "react";

const Carousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    {
      image: "img/carousel-1.jpg",
      alt: "Coffee Image 1",
    },
    {
      image: "img/carousel-2.jpg",
      alt: "Coffee Image 2",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[600px] mb-20 overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute w-full h-full transition-opacity duration-500 
            ${activeSlide === index ? "opacity-100" : "opacity-0"}`}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black bg-opacity-50">
            <h2 className="text-primary font-medium mb-2">
              We Have Been Serving
            </h2>
            <h1 className="text-white text-7xl mb-2">COFFEE</h1>
            <h2 className="text-white">* SINCE 1950 *</h2>
          </div>
        </div>
      ))}

      <button
        onClick={() =>
          setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length)
        }
        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white"
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={() => setActiveSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white"
      >
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
};

export default Carousel;
