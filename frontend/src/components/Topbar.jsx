import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import { useMediaQuery, Badge } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/userSlice";
import { fetchUsers } from "../redux/usersSlice";

const Topbar = ({ cart }) => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const { t, i18n } = useTranslation();
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { userInfo, userRole } = useSelector((state) => state.user);
  const savedToken = localStorage.getItem("token");
  const isLoggedIn = Boolean(savedToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // Only fetch users if there's a valid token and user is logged in
    if (token && userInfo) {
      dispatch(fetchUsers(token));
    }
  }, [dispatch, userInfo]);

  const handleLogout = () => {
    setOpenModal(true);
  };

  const handleModalClose = (confirm) => {
    if (confirm) {
      dispatch(logoutUser());
      localStorage.clear();
      navigate("/");
    }
    setOpenModal(false);
  };

  const handleLanguageMenu = (event) => {
    setLanguageAnchorEl(event.currentTarget);
  };

  const handleCloseLanguageMenu = () => {
    setLanguageAnchorEl(null);
  };

  const toggleLanguage = (language) => {
    i18n.changeLanguage(language);
    handleCloseLanguageMenu();
  };

  const getTotalItems = () => {
    return cart?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  const getNavigationLinks = () => {
    const baseLinks = [
      { id: 1, title: t("home"), url: "/" },
      { id: 2, title: t("menu"), url: "/menu" },
    ];

    if (isLoggedIn) {
      if (userRole === "Barista") {
        return [
          ...baseLinks,
          { id: 4, title: t("dashboard"), url: "/barista-dashboard" },
        ];
      }
      return [
        ...baseLinks,
        { id: 3, title: t("profile"), url: `/profile/${userInfo._id}` },
      ];
    }

    return [
      ...baseLinks,
      {
        id: 5,
        title: isLoggedIn ? t("login") : t("logout"),
        url: isLoggedIn ? "/login" : "/",
      },
    ];
  };

  const links = getNavigationLinks();

  return (
    <div
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        isScrolled
          ? `bg-secondary/70 backdrop-blur-md text-light`
          : `bg-transparent text-light`
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <h1
            className={`${
              isNonMobile ? "text-2xl" : "text-sm"
            } font-semibold text-[#FFF8F0]`}
          >
            {t("Coffee Shop")}
          </h1>

          {/* Only show these items on non-mobile screens */}
          {isNonMobile && (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={handleLanguageMenu}
                  className="p-2 text-[#FFF8F0] hover:text-primary transition-colors rounded-full"
                >
                  <TranslateOutlinedIcon />
                </button>
                {Boolean(languageAnchorEl) && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                    <button
                      onClick={() => toggleLanguage("en")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      English
                    </button>
                    <button
                      onClick={() => toggleLanguage("ar")}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      العربية
                    </button>
                  </div>
                )}
              </div>

              <nav className="flex items-center space-x-4">
                {links.map((item) => (
                  <Link
                    key={item.id}
                    to={item.url}
                    className="text-[#FFF8F0] hover:text-primary transition-colors capitalize nav-link"
                  >
                    {item.title}
                  </Link>
                ))}
                <Link
                  to="/cart"
                  className="text-[#FFF8F0] hover:text-primary transition-colors"
                >
                  <Badge
                    badgeContent={getTotalItems()}
                    color="primary"
                    sx={{
                      "& .MuiBadge-badge": {
                        backgroundColor: "#DA9F5B",
                        color: "white",
                      },
                    }}
                  >
                    <ShoppingCartIcon />
                  </Badge>
                </Link>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
