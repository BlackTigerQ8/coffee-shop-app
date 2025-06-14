import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import { useMediaQuery, Badge, Menu, MenuItem } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/userSlice";
import { fetchUsers } from "../redux/usersSlice";
import Modal from "./Modal";

const Topbar = ({ cart }) => {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { t, i18n } = useTranslation();
  const [languageAnchorEl, setLanguageAnchorEl] = useState(null);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const { userInfo, userRole, token } = useSelector((state) => state.user);
  const isLoggedIn = Boolean(token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  useEffect(() => {
    // Only fetch users if user is logged in and has a valid token
    if (isLoggedIn && userInfo && userRole === "Admin") {
      const token = localStorage.getItem("token");
      dispatch(fetchUsers(token));
    }
  }, [dispatch, userInfo, isLoggedIn, userRole]);

  const handleLogout = () => {
    setOpenModal(true);
  };

  const handleModalClose = (confirm) => {
    if (confirm) {
      localStorage.clear();
      dispatch(logoutUser());
      navigate("/");
    }
    setOpenModal(false);
  };

  const handleLanguageMenu = () => {
    setIsLanguageMenuOpen(!isLanguageMenuOpen);
  };

  const handleCloseLanguageMenu = () => {
    setIsLanguageMenuOpen(false);
  };

  const toggleLanguage = (language) => {
    i18n.changeLanguage(language);
    setIsLanguageMenuOpen(false);
  };

  const getTotalItems = () => {
    return cart?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  const getNavigationLinks = () => {
    const baseLinks = [
      { id: 1, title: t("home"), url: "/" },
      { id: 2, title: t("menu"), url: "/menu" },
    ];

    const adminLinks = [
      ...baseLinks,
      { id: 3, title: t("dashboard"), url: "/barista-dashboard" },
      { id: 4, title: t("manage_menu"), url: "/menu/management" },
    ];

    const baristaLinks = [
      ...baseLinks,
      { id: 5, title: t("dashboard"), url: "/barista-dashboard" },
      { id: 6, title: t("manage_menu"), url: "/menu/management" },
    ];

    const customerLinks = [
      ...baseLinks,
      { id: 7, title: t("cart"), url: "/cart" },
    ];

    if (isLoggedIn) {
      const roleSpecificLinks =
        userRole === "Barista"
          ? baristaLinks
          : userRole === "Admin"
          ? adminLinks
          : customerLinks;

      return roleSpecificLinks;
    }

    return baseLinks;
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
              isDesktop ? "text-2xl" : "text-sm"
            } font-semibold text-[#FFF8F0]`}
          >
            {t("Coffee Shop")}
          </h1>

          {/* Only show these items on non-mobile screens */}
          {isDesktop && (
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={handleLanguageMenu}
                  className="p-2 text-[#FFF8F0] hover:text-primary transition-colors rounded-full"
                >
                  <TranslateOutlinedIcon />
                </button>
                {isLanguageMenuOpen && (
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

              {/* Navigation Links */}
              <nav className="flex items-center space-x-4">
                {links.map((item) => (
                  <Link
                    key={item.id}
                    to={item.url}
                    onClick={item.onClick}
                    className="text-[#FFF8F0] hover:text-primary transition-colors capitalize nav-link"
                  >
                    {item.title}
                  </Link>
                ))}

                {/* Profile Menu */}
                <div>
                  <button
                    onClick={handleProfileMenuOpen}
                    className="p-2 text-[#FFF8F0] hover:text-primary transition-colors rounded-full"
                  >
                    <AccountCircleIcon />
                  </button>
                  <Menu
                    anchorEl={profileAnchorEl}
                    open={Boolean(profileAnchorEl)}
                    onClose={handleProfileMenuClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "center",
                    }}
                  >
                    {isLoggedIn ? (
                      <>
                        <MenuItem
                          onClick={() => {
                            handleProfileMenuClose();
                            navigate(`/profile/${userInfo?._id}`);
                          }}
                        >
                          {t("profile")}
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            handleProfileMenuClose();
                            handleLogout();
                          }}
                        >
                          {t("logout")}
                        </MenuItem>
                      </>
                    ) : (
                      <MenuItem
                        onClick={() => {
                          handleProfileMenuClose();
                          navigate("/login");
                        }}
                      >
                        {t("login")}
                      </MenuItem>
                    )}
                  </Menu>
                </div>

                {/* Cart - Only show for customers */}
                {userRole === "Customer" && (
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
                )}
              </nav>
            </div>
          )}
        </div>
      </div>
      <Modal
        open={openModal}
        onClose={() => handleModalClose(false)}
        onConfirm={() => handleModalClose(true)}
        title={t("confirmLogout")}
        message={t("logoutConfirmation")}
      />
    </div>
  );
};

export default Topbar;
