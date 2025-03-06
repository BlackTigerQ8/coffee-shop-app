import React from "react";
import Carousel from "../components/Carousel";
import About from "../components/About";
import Services from "../components/Services";
import Offer from "../components/Offer";
import Menu from "../components/Menu";
import Reservation from "../components/Reservation";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";

const landingPage = () => {
  return (
    <>
      <Carousel />
      <About />
      <Services />
      <Offer />
      <Menu />
      <Reservation />
      <Testimonials />
      <Footer />
      <BackToTop />
    </>
  );
};

export default landingPage;
