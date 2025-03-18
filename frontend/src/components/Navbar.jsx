import { useState, useEffect } from "react";
import { Twirl as Hamburger } from "hamburger-react";
import { useTranslation } from "react-i18next";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import HomeIcon from "@mui/icons-material/Home";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Badge,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import InfoIcon from "@mui/icons-material/Info";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { DashboardCustomize as DashboardIcon } from "@mui/icons-material";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import PersonIcon from "@mui/icons-material/Person";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const Navbar = ({ cart }) => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [languageAnchorEl, setLanguageAnchorEl] = useState(false);
  const { userInfo, userRole, token } = useSelector((state) => state.user);
  const isLoggedIn = Boolean(token);
  const [openModal, setOpenModal] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Close mobile menu when clicking outside
  useEffect(() => {
    const pageContent = document.getElementById("page-content");
    if (isOpen) {
      if (pageContent) pageContent.style.filter = "blur(5px)";
    } else if (pageContent) {
      pageContent.style.filter = "none";
    }

    return () => {
      if (pageContent) pageContent.style.filter = "none";
    };
  }, [isOpen]);

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

  const handleLanguageMenu = () => {
    setLanguageAnchorEl(!languageAnchorEl);
  };

  const toggleLanguage = (language) => {
    i18n.changeLanguage(language);
    setLanguageAnchorEl(false);
  };

  const getTotalItems = () => {
    return cart?.reduce((total, item) => total + item.quantity, 0) || 0;
  };

  const menuVariants = {
    closed: {
      x: "100%",
      transition: {
        type: "tween",
        duration: 0.1,
        ease: "easeInOut",
        when: "afterChildren",
      },
    },
    open: {
      x: 0,
      transition: {
        type: "tween",
        duration: 0.3,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    closed: {
      x: 50,
      opacity: 0,
    },
    open: {
      x: 0,
      opacity: 1,
    },
  };

  const linkHoverVariants = {
    initial: { x: 0 },
    hover: {
      x: 10,
      transition: {
        duration: 0.2,
        ease: "easeInOut",
      },
    },
  };

  const getNavigationLinks = () => {
    const baseLinks = [
      { id: 1, title: t("home"), url: "/", icon: <HomeIcon /> },
      { id: 2, title: t("menu"), url: "/menu", icon: <RestaurantMenuIcon /> },
    ];

    if (isLoggedIn) {
      const roleSpecificLinks =
        userRole === "Barista"
          ? [
              {
                id: 3,
                title: t("dashboard"),
                url: "/barista-dashboard",
                icon: <DashboardIcon />,
              },
            ]
          : [
              {
                id: 4,
                title: t("profile"),
                url: `/profile/${userInfo._id}`,
                icon: <PersonIcon />,
              },
              {
                id: 5,
                title: t("cart"),
                url: "/cart",
                icon: (
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
                ),
              },
            ];

      return [
        ...baseLinks,
        ...roleSpecificLinks,
        {
          id: 6,
          title: t("logout"),
          url: "/",
          onClick: handleLogout,
          icon: <LogoutIcon />,
        },
      ];
    }

    return [
      ...baseLinks,
      { id: 6, title: t("login"), url: "/login", icon: <PersonIcon /> },
    ];
  };

  const links = getNavigationLinks();

  // const test = [
  //   { id: 1, title: t("home"), url: "/", icon: <HomeIcon /> },
  //   { id: 2, title: t("menu"), url: "/menu", icon: <RestaurantMenuIcon /> },
  //   {
  //     id: 3,
  //     title: t("user_profile"),
  //     url: "/profile",
  //     icon: <PersonIcon />,
  //   },
  //   {
  //     id: 4,
  //     title: t("dashboard"),
  //     url: "/barista-dashboard",
  //     icon: <DashboardIcon />,
  //   },
  //   {
  //     id: 5,
  //     title: t("cart"),
  //     url: "/cart",
  //     icon: (
  //       <Badge
  //         badgeContent={getTotalItems()}
  //         color="primary"
  //         sx={{
  //           "& .MuiBadge-badge": {
  //             backgroundColor: "#DA9F5B",
  //             color: "white",
  //           },
  //         }}
  //       >
  //         <ShoppingCartIcon />
  //       </Badge>
  //     ),
  //   },
  //   { id: 5, title: t("login"), url: "/login", icon: <PersonIcon /> },
  // ];

  return (
    <>
      {/* Hamburger Button */}
      <div className="fixed top-2 right-4 z-[60]">
        <Hamburger
          toggled={isOpen}
          toggle={setIsOpen}
          color="#FFF8F0"
          size={30}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="fixed inset-y-0 right-0 w-64 bg-secondary z-50 p-8 flex flex-col"
            >
              <div className="flex flex-col space-y-6 mt-16">
                {links.map((link) => (
                  <motion.div key={link.id} variants={itemVariants}>
                    <motion.div
                      initial="initial"
                      whileHover="hover"
                      variants={linkHoverVariants}
                    >
                      <Link
                        to={link.url}
                        className="group text-light flex items-center gap-2 uppercase text-sm nav-link"
                        onClick={(e) => {
                          if (link.onClick) {
                            e.preventDefault();
                            link.onClick();
                          }
                          setIsOpen(false);
                        }}
                      >
                        <span className="text-light flex items-center group-hover:text-primary transition-colors duration-300">
                          {link.icon}
                        </span>
                        <span className="text-light group-hover:text-primary transition-colors duration-300">
                          {link.title}
                        </span>
                      </Link>
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* Language Selector at Bottom */}
              <motion.div className="mt-auto" variants={itemVariants}>
                <motion.div
                  initial="initial"
                  whileHover="hover"
                  variants={linkHoverVariants}
                >
                  <button
                    onClick={handleLanguageMenu}
                    className="group text-light flex items-center space-x-2"
                  >
                    <TranslateOutlinedIcon className="group-hover:text-primary transition-colors duration-300" />
                    <span className="group-hover:text-primary transition-colors duration-300">
                      {t("changeLanguage")}
                    </span>
                  </button>
                </motion.div>

                {languageAnchorEl && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-2 bg-white rounded-md shadow-lg py-1"
                  >
                    <button
                      onClick={() => {
                        toggleLanguage("en");
                        setLanguageAnchorEl(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-300"
                    >
                      English
                    </button>
                    <button
                      onClick={() => {
                        toggleLanguage("ar");
                        setLanguageAnchorEl(null);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-300"
                    >
                      العربية
                    </button>
                  </motion.div>
                )}
              </motion.div>
            </motion.div>

            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
      <Dialog
        open={openModal}
        onClose={() => handleModalClose(false)}
        aria-labelledby="logout-dialog-title"
        aria-describedby="logout-dialog-description"
      >
        <DialogTitle id="logout-dialog-title">{t("confirmLogout")}</DialogTitle>
        <DialogContent>
          <DialogContentText id="logout-dialog-description">
            {t("logoutConfirmation")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleModalClose(false)} color="primary">
            {t("cancel")}
          </Button>
          <Button
            onClick={() => handleModalClose(true)}
            color="primary"
            autoFocus
          >
            {t("logout")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
