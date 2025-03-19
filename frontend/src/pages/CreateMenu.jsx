import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as yup from "yup";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Backdrop from "../components/Backdrop";

const CreateMenu = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get user info from Redux store to check role
  const { userInfo } = useSelector((state) => state.user);
  const isAuthorized =
    userInfo?.role === "Admin" || userInfo?.role === "Barista";

  const validationSchema = yup.object().shape({
    name: yup.string().required(t("name_required")),
    price: yup
      .number()
      .required(t("price_required"))
      .positive(t("price_positive")),
    category: yup.string().required(t("category_required")),
    image: yup.mixed().required(t("image_required")),
  });

  const initialValues = {
    name: "",
    price: "",
    category: "",
    image: null,
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    if (!isAuthorized) {
      navigate("/");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key !== "image") {
          formData.append(key, values[key]);
        }
      });

      if (values.image) {
        formData.append("image", values.image);
      }

      // TODO: Add the createMenuItem action and dispatch it here
      // await dispatch(createMenuItem(formData)).unwrap();

      resetForm();
      setPreviewImage(null);
      navigate("/menu");
    } catch (error) {
      console.error("Failed to create menu item:", error);
    } finally {
      setSubmitting(false);
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.2 },
    },
  };

  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setFieldValue("image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isAuthorized) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        title={t("create_menu_item")}
        subtitle={t("create_menu_item_subtitle")}
      />

      <Backdrop isOpen={isLoading} />

      <div className="flex-grow container mx-auto px-4 mb-8">
        <motion.div
          className="max-w-2xl mx-auto bg-secondary text-white p-8 rounded-lg my-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          ref={ref}
        >
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, setFieldValue, isSubmitting }) => (
              <Form className="space-y-6">
                <TextField
                  fullWidth
                  name="name"
                  label={t("item_name")}
                  onChange={(e) => setFieldValue("name", e.target.value)}
                  error={touched.name && !!errors.name}
                  helperText={touched.name && errors.name}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": { borderColor: "#DA9F5B" },
                    },
                    "& .MuiInputLabel-root": { color: "white" },
                  }}
                />

                <TextField
                  fullWidth
                  name="price"
                  label={t("price")}
                  type="number"
                  onChange={(e) => setFieldValue("price", e.target.value)}
                  error={touched.price && !!errors.price}
                  helperText={touched.price && errors.price}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": { borderColor: "#DA9F5B" },
                    },
                    "& .MuiInputLabel-root": { color: "white" },
                  }}
                />

                <FormControl fullWidth>
                  <InputLabel sx={{ color: "white" }}>
                    {t("category")}
                  </InputLabel>
                  <Select
                    name="category"
                    onChange={(e) => setFieldValue("category", e.target.value)}
                    error={touched.category && !!errors.category}
                    sx={{
                      color: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#DA9F5B",
                      },
                    }}
                  >
                    <MenuItem value="Hot Drinks">{t("hot_drinks")}</MenuItem>
                    <MenuItem value="Cold Drinks">{t("cold_drinks")}</MenuItem>
                    <MenuItem value="Snacks">{t("snacks")}</MenuItem>
                    <MenuItem value="Food">{t("food")}</MenuItem>
                  </Select>
                </FormControl>

                <Box className="space-y-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setFieldValue)}
                    style={{ display: "none" }}
                    id="image-upload"
                  />
                  <label htmlFor="image-upload">
                    <Button
                      component="span"
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: "#DA9F5B",
                        "&:hover": {
                          backgroundColor: "#c48f51",
                        },
                      }}
                    >
                      {t("upload_image")}
                    </Button>
                  </label>
                  {previewImage && (
                    <div className="mt-4">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="max-w-full h-48 object-cover rounded"
                      />
                    </div>
                  )}
                  {touched.image && errors.image && (
                    <div className="text-red-500 text-sm">{errors.image}</div>
                  )}
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    backgroundColor: "#DA9F5B",
                    "&:hover": {
                      backgroundColor: "#c48f51",
                    },
                  }}
                >
                  {t("create_item")}
                </Button>
              </Form>
            )}
          </Formik>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default CreateMenu;
