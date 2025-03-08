import React, { useState } from "react";
import "./index.css";
import "./App.css";
import { useMediaQuery } from "@mui/material";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Topbar from "./components/Topbar";
import LandingPage from "./pages/landingPage";
import MenuPage from "./pages/menuPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import UserAuthPage from "./pages/UserAuthPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import UserProfilePage from "./pages/UserProfilePage";
import BaristaDashboard from "./pages/BaristaDashboard";
function App() {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [cart, setCart] = useState([]);

  return (
    <div className="font-montserrat text-coffee bg-light">
      {!isNonMobile && <Navbar cart={cart} />}
      <Topbar cart={cart} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/menu"
          element={<MenuPage cart={cart} setCart={setCart} />}
        />
        <Route
          path="/cart"
          element={<CartPage cart={cart} setCart={setCart} />}
        />
        <Route
          path="/checkout"
          element={<CheckoutPage cart={cart} setCart={setCart} />}
        />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/login" element={<UserAuthPage />} />
        <Route path="/profile" element={<UserProfilePage />} />
        <Route path="/barista-dashboard" element={<BaristaDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
