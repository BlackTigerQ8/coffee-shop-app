import { useState, useEffect } from "react";

const TestimonialCard = ({ image, name, profession, text }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <div className="flex items-center mb-4">
      <img
        src={image}
        alt={name}
        className="w-16 h-16 rounded-full object-cover"
      />
      <div className="ml-4">
        <h4 className="text-xl font-bold">{name}</h4>
        <p className="text-gray-600 italic">{profession}</p>
      </div>
    </div>
    <p className="text-gray-700">{text}</p>
  </div>
);

const Testimonials = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const testimonials = [
    {
      image: "img/testimonial-1.jpg",
      name: "Client Name",
      profession: "Profession",
      text: "Sed ea amet kasd elitr stet, stet rebum et ipsum est duo elitr eirmod clita lorem. Dolor tempor ipsum sanct clita",
    },
    // Add more testimonials...
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="container mx-auto py-20">
      <div className="text-center mb-16">
        <h4 className="text-primary uppercase tracking-[5px]">Testimonial</h4>
        <h1 className="text-4xl font-bold">Our Clients Say</h1>
      </div>

      <div className="relative">
        <div className="flex overflow-hidden">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`w-full flex-shrink-0 transition-transform duration-500 ease-in-out transform
                ${
                  index === activeSlide ? "translate-x-0" : "translate-x-full"
                }`}
            >
              <TestimonialCard {...testimonial} />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveSlide(index)}
              className={`w-3 h-3 rounded-full ${
                index === activeSlide ? "bg-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
