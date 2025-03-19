import React, { useState } from "react";
import "./index.css";
import "./App.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import { hourglass } from "ldrs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CreateMenu from "./pages/CreateMenu";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import i18next from "i18next";
function App() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [cart, setCart] = useState([]);
  hourglass.register();

  const ProtectedRoute = ({ children, roles }) => {
    const { userInfo } = useSelector((state) => state.user);
    const navigate = useNavigate();

    useEffect(() => {
      if (!userInfo || !roles.includes(userInfo.role)) {
        toast.error(i18next.t("unauthorized"));
      }
    }, [userInfo, roles, navigate]);

    return userInfo && roles.includes(userInfo.role) ? children : null;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="font-montserrat text-coffee bg-light">
        {!isDesktop && <Navbar cart={cart} />}

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
          <Route
            path="/order-confirmation"
            element={<OrderConfirmationPage />}
          />
          <Route path="/login" element={<UserAuthPage />} />
          <Route path="/profile/:id" element={<UserProfilePage />} />
          <Route path="/barista-dashboard" element={<BaristaDashboard />} />

          <Route
            path="/menu/create"
            element={
              <ProtectedRoute roles={["Admin", "Barista"]}>
                <CreateMenu />
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer />
      </div>
    </LocalizationProvider>
  );
}

export default App;
