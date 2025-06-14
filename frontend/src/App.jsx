import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMediaQuery } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { hourglass } from "ldrs";
import i18next from "i18next";

// Components
import Navbar from "./components/Navbar";
import Topbar from "./components/Topbar";

// Pages
import LandingPage from "./pages/landingPage";
import MenuPage from "./pages/menuPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import UserAuthPage from "./pages/UserAuthPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import UserProfilePage from "./pages/UserProfilePage";
import BaristaDashboard from "./pages/BaristaDashboard";
import MenuManagement from "./pages/MenuManagement";
import NotFoundPage from "./pages/NotFoundPage";
import CreateMenu from "./pages/CreateMenu";
// Styles
import "./index.css";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

// Route configurations
const publicRoutes = [
  {
    path: "/",
    element: LandingPage,
  },
  {
    path: "/menu",
    element: MenuPage,
  },
  {
    path: "/login",
    element: UserAuthPage,
    isAuth: true, // Special flag for auth routes
  },
];

const protectedRoutes = [
  {
    path: "/cart",
    element: CartPage,
    roles: ["Customer"],
  },
  {
    path: "/checkout",
    element: CheckoutPage,
    roles: ["Customer"],
  },
  {
    path: "/order-confirmation",
    element: OrderConfirmationPage,
    roles: ["Customer"],
  },
  {
    path: "/profile/:id",
    element: UserProfilePage,
    roles: ["Admin", "Barista", "Customer"],
  },
  {
    path: "/barista-dashboard",
    element: BaristaDashboard,
    roles: ["Admin", "Barista"],
  },
  {
    path: "/menu/management",
    element: MenuManagement,
    roles: ["Admin", "Barista"],
  },
  {
    path: "/menu/create",
    element: CreateMenu,
    roles: ["Admin", "Barista"],
  },
];

// Error routes configuration
const errorRoutes = [
  {
    path: "*", // Catch all unmatched routes
    element: NotFoundPage,
  },
];

// Route Guard Components
const ProtectedRoute = ({ children, roles }) => {
  const { userInfo } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo || !roles.includes(userInfo.role)) {
      toast.error(i18next.t("unauthorized"), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
      navigate("/");
    }
  }, [userInfo, roles, navigate]);

  return userInfo && roles.includes(userInfo.role) ? children : null;
};

const PublicRoute = ({ children }) => {
  const { token } = useSelector((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return !token ? children : null;
};

function App() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [cart, setCart] = useState([]);
  const location = useLocation();
  const isNotFoundPage = location.pathname === "*";
  // Register loading animation
  hourglass.register();

  // Helper function to handle cart props
  const withCartProps = (Element) => {
    return <Element cart={cart} setCart={setCart} />;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="font-montserrat text-coffee bg-light">
        {/* Navigation - Only show if not on 404 page */}
        {!isNotFoundPage && (
          <>
            {!isDesktop && <Navbar cart={cart} />}
            <Topbar cart={cart} />
          </>
        )}

        {/* Navigation */}
        {/* {!isDesktop && <Navbar cart={cart} />}
        <Topbar cart={cart} /> */}

        {/* Routes */}
        <Routes>
          {/* Public Routes */}
          {publicRoutes.map(({ path, element: Element, isAuth }) => (
            <Route
              key={path}
              path={path}
              element={
                isAuth ? (
                  <PublicRoute>{withCartProps(Element)}</PublicRoute>
                ) : (
                  withCartProps(Element)
                )
              }
            />
          ))}

          {/* Protected Routes */}
          {protectedRoutes.map(({ path, element: Element, roles }) => (
            <Route
              key={path}
              path={path}
              element={
                <ProtectedRoute roles={roles}>
                  {withCartProps(Element)}
                </ProtectedRoute>
              }
            />
          ))}

          {/* Error Routes - Must be last */}
          {errorRoutes.map(({ path, element: Element }) => (
            <Route key={path} path={path} element={<Element />} />
          ))}
        </Routes>

        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    </LocalizationProvider>
  );
}

export default App;
