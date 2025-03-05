import React from "react";
import "./index.css";
import "./App.css";
import "./assets/carousel-icons.css";
import { useMediaQuery } from "@mui/material";
import Navbar from "./components/Navbar";
import Carousel from "./components/Carousel";
import About from "./components/About";
import Services from "./components/Services";
import Offer from "./components/Offer";
import Menu from "./components/Menu";
import Reservation from "./components/Reservation";
import Testimonials from "./components/Testimonials";
import Footer from "./components/Footer";
import BackToTop from "./components/BackToTop";
import Topbar from "./components/Topbar";
function App() {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  return (
    <div className="font-roboto text-coffee bg-light">
      {!isNonMobile && <Navbar />}
      <Topbar />
      <Carousel />
      <About />
      <Services />
      <Offer />
      <Menu />
      <Reservation />
      <Testimonials />
      <Footer />
      <BackToTop />
    </div>
  );
}

export default App;
