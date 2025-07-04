import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";
import { useTranslation } from "react-i18next";
import {
  TextField,
  Button,
  Paper,
  Tabs,
  Tab,
  Avatar,
  Divider,
  Box,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  History as HistoryIcon,
  AddAPhoto as AddPhotoIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../redux/usersSlice";
import { setUser } from "../redux/userSlice";

const UserProfilePage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);
  const { userInfo } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    firstName: userInfo?.firstName || "",
    lastName: userInfo?.lastName || "",
    email: userInfo?.email || "",
    phone: userInfo?.phone || "",
    address: userInfo?.address || "",
  });

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (userInfo?.image) {
      setProfileImage(userInfo.image);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo) {
      setFormData({
        firstName: userInfo.firstName || "",
        lastName: userInfo.lastName || "",
        email: userInfo.email || "",
        phone: userInfo.phone || "",
        address: userInfo.address || "",
      });
    }
  }, [userInfo]);

  // Handle file selection
  const handleFileSelect = (file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handlers for drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.2 },
    },
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#DA9F5B",
      },
      "&:hover fieldset": {
        borderColor: "#c48f51",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#DA9F5B",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#656565",
      "&.Mui-focused": {
        color: "#DA9F5B",
      },
    },
  };

  const mockOrders = [
    {
      id: "ORD-001",
      date: "2024-03-15",
      total: 42.5,
      status: "delivered",
      items: [
        { name: "Cappuccino", quantity: 2, price: 8.5 },
        { name: "Croissant", quantity: 3, price: 8.5 },
      ],
    },
    // Add more mock orders as needed
  ];

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (profileImage && profileImage.startsWith("data:image")) {
        const response = await fetch(profileImage);
        const blob = await response.blob();
        formDataToSend.append("image", blob, "profile-image.jpg");
      }

      const result = await dispatch(
        updateUser({
          userId: userInfo._id,
          formData: formDataToSend,
        })
      ).unwrap();

      // Update Redux state to match login state structure
      const token = localStorage.getItem("token");
      const updatedUser = result.data.user;

      dispatch(
        setUser({
          userInfo: updatedUser,
          token: token,
          user: updatedUser,
          userRole: updatedUser.role,
        })
      );

      // Force a refresh of the form data
      setFormData({
        firstName: updatedUser.firstName || "",
        lastName: updatedUser.lastName || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
        address: updatedUser.address || "",
      });

      // Update profile image state if there's a new image
      if (updatedUser.image) {
        setProfileImage(updatedUser.image);
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const renderProfileInfo = () => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      <div className="flex flex-col items-center justify-center mb-8">
        <div
          className={`relative group cursor-pointer rounded-full ${
            isDragging ? "ring-4 ring-primary ring-opacity-50" : ""
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <img
            src={`${API_URL}/${userInfo?.image || profileImage}`}
            alt={userInfo?.firstName || "Profile Image"}
            crossOrigin="anonymous"
            onError={(e) => {
              console.error("Failed to load image:", e.target.src);
              e.target.onerror = null;
              e.target.src = `data:image/svg+xml,${encodeURIComponent(
                '<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24"><path fill="#DA9F5B" d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'
              )}`;
            }}
            className="w-[120px] h-[120px] rounded-full object-cover"
          />

          {/* Overlay for hover effect */}
          <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
            <AddPhotoIcon
              className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              sx={{ fontSize: "2rem" }}
            />
          </div>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files[0])}
        />

        {/* Upload instructions */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-coffee mt-2 text-center"
        >
          {t("click_or_drag_photo")}
        </motion.p>

        {/* Remove photo button - only show if there's a profile image */}
        {(userInfo?.image || profileImage) && (
          <Button
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              // Create FormData with empty image
              const formDataToSend = new FormData();
              formDataToSend.append("image", ""); // Send empty string to remove image

              // Dispatch update
              dispatch(
                updateUser({
                  userId: userInfo._id,
                  formData: formDataToSend,
                })
              ).then((result) => {
                if (result.payload) {
                  const updatedUser = result.payload.data.user;
                  // Update Redux state
                  dispatch(
                    setUser({
                      userInfo: updatedUser,
                      token: localStorage.getItem("token"),
                      user: updatedUser,
                      userRole: updatedUser.role,
                    })
                  );
                  // Clear local image state
                  setProfileImage(null);
                }
              });
            }}
            sx={{
              color: "#DA9F5B",
              mt: 1,
              "&:hover": {
                backgroundColor: "rgba(218, 159, 91, 0.04)",
              },
            }}
          >
            {t("remove_photo")}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TextField
          fullWidth
          label={t("first_name")}
          value={formData.firstName}
          onChange={(e) =>
            setFormData({ ...formData, firstName: e.target.value })
          }
          sx={textFieldStyles}
        />
        <TextField
          fullWidth
          label={t("last_name")}
          value={formData.lastName}
          onChange={(e) =>
            setFormData({ ...formData, lastName: e.target.value })
          }
          sx={textFieldStyles}
        />
        <TextField
          fullWidth
          label={t("email")}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          sx={textFieldStyles}
        />
        <TextField
          fullWidth
          label={t("phone")}
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          sx={textFieldStyles}
        />
        <TextField
          fullWidth
          label={t("address")}
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          multiline
          rows={3}
          sx={textFieldStyles}
          className="md:col-span-2"
        />
      </div>

      <div className="flex justify-end mt-6">
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveProfile}
          disabled={isSaving}
          sx={{
            backgroundColor: "#DA9F5B",
            "&:hover": {
              backgroundColor: "#c48f51",
            },
          }}
        >
          {isSaving ? t("updating") : t("update_profile")}
        </Button>
      </div>
    </motion.div>
  );

  const renderOrderHistory = () => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      {mockOrders.map((order) => (
        <Paper key={order.id} elevation={0} className="p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-bold text-secondary">
                {t("order_id")}: {order.id}
              </h3>
              <p className="text-coffee">{order.date}</p>
            </div>
            <span className="text-primary font-bold">
              ${order.total.toFixed(2)}
            </span>
          </div>
          <Divider className="my-4" />
          <div className="space-y-2 my-4 ">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span>
                  {item.quantity}x {item.name}
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <Divider className="my-4" />
          <div className="text-right mt-4">
            <span className="px-4 py-1 rounded-full bg-primary text-white">
              {t(order.status)}
            </span>
          </div>
        </Paper>
      ))}
    </motion.div>
  );

  return (
    <div ref={ref} className="flex flex-col min-h-screen">
      <Header
        title={t("user_profile_title")}
        subtitle={t("user_profile_subtitle")}
      />
      <motion.div
        className="flex-grow container mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <Paper elevation={0} className="p-6 rounded-lg">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            centered
            sx={{
              mb: 4,
              "& .MuiTab-root": { color: "#656565" },
              "& .Mui-selected": { color: "#DA9F5B !important" },
              "& .MuiTabs-indicator": { backgroundColor: "#DA9F5B" },
            }}
          >
            <Tab
              icon={<PersonIcon />}
              label={t("profile")}
              iconPosition="start"
            />
            <Tab
              icon={<HistoryIcon />}
              label={t("order_history")}
              iconPosition="start"
            />
          </Tabs>

          <Box className="mt-6">
            {activeTab === 0 && renderProfileInfo()}
            {activeTab === 1 && renderOrderHistory()}
          </Box>
        </Paper>
      </motion.div>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default UserProfilePage;
