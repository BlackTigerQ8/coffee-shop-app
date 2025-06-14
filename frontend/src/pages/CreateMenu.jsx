import React, { useState, useRef, useEffect } from "react";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Formik, Form } from "formik";
import * as yup from "yup";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Backdrop from "../components/Backdrop";
import { createMenuItem } from "../redux/menuSlice";
import {
  fetchCategories,
  createCategory,
  deleteCategory,
  updateCategory,
} from "../redux/categorySlice";

const CreateMenu = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const { categories, status: categoryStatus } = useSelector(
    (state) => state.category
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Get user info from Redux store to check role
  const { userInfo } = useSelector((state) => state.user);
  const isAuthorized =
    userInfo?.role === "Admin" || userInfo?.role === "Barista";

  const validationSchema = yup.object().shape({
    name: yup.string().required(t("item_name_required")),
    price: yup
      .number()
      .required(t("item_price_required"))
      .positive(t("item_price_positive"))
      .typeError(t("item_price_valid_number")),
    category: yup.string().required(t("item_category_required")),
  });

  const initialValues = {
    name: "",
    description: "",
    price: null,
    category: "",
    image: null,
  };

  const handleCreateCategory = async () => {
    try {
      await dispatch(createCategory(newCategory)).unwrap();
      setNewCategory("");
      setOpenDialog(false);
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  // Handle edit and delete actions
  const handleEditCategory = (category) => {
    // Open dialog to edit category
    setNewCategory(category.name);
    setEditingCategoryId(category._id);
    setOpenDialog(true);
  };

  const handleDeleteCategory = async (id) => {
    try {
      await dispatch(deleteCategory(id)).unwrap();
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  // Update category in dialog
  const handleUpdateCategory = async () => {
    try {
      await dispatch(
        updateCategory({ id: editingCategoryId, name: newCategory })
      ).unwrap();
      setNewCategory("");
      setOpenDialog(false);
    } catch (error) {
      console.error("Failed to update category:", error);
    }
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
        if (key !== "image" && key !== "category") {
          formData.append(key, values[key]);
        }
      });

      formData.append("category", values.category);

      if (values.image) {
        formData.append("image", values.image);
      }

      await dispatch(createMenuItem(formData)).unwrap();

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
            {({ errors, touched, setFieldValue, isSubmitting, values }) => (
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
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#FFF8F0",
                    },
                  }}
                />

                <TextField
                  fullWidth
                  name="description"
                  label={t("description")}
                  onChange={(e) => setFieldValue("description", e.target.value)}
                  multiline
                  rows={4}
                  error={touched.description && !!errors.description}
                  helperText={touched.description && errors.description}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": { borderColor: "#DA9F5B" },
                    },
                    "& .MuiInputLabel-root": { color: "white" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#FFF8F0",
                    },
                  }}
                />

                <TextField
                  fullWidth
                  name="price"
                  label={t("price")}
                  type="number"
                  inputProps={{ step: "0.01" }}
                  onChange={(e) => setFieldValue("price", e.target.value)}
                  error={touched.price && !!errors.price}
                  helperText={touched.price && errors.price}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      "& fieldset": { borderColor: "#DA9F5B" },
                    },
                    "& .MuiInputLabel-root": { color: "white" },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#FFF8F0",
                    },
                  }}
                />

                <FormControl fullWidth>
                  <InputLabel sx={{ color: "white" }}>
                    {t("category")}
                  </InputLabel>
                  <Select
                    name="category"
                    value={values.category || ""}
                    onChange={(e) => setFieldValue("category", e.target.value)}
                    error={touched.category && !!errors.category}
                    sx={{
                      color: "white",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#DA9F5B",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#FFF8F0",
                      },
                      "& .MuiInputLabel-root": { color: "white" },
                    }}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                        <Button onClick={() => handleEditCategory(category)}>
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteCategory(category._id)}
                        >
                          Delete
                        </Button>
                      </MenuItem>
                    ))}
                  </Select>
                  <Button
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                    sx={{
                      mt: 1,
                      color: "white",
                      borderColor: "#DA9F5B",
                      "&:hover": {
                        borderColor: "#c48f51",
                      },
                    }}
                    variant="outlined"
                  >
                    {t("add_new_category")}
                  </Button>
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

      {/* Add Category Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{t("create_new_category")}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t("category_name")}
            fullWidth
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            sx={{
              mt: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#DA9F5B",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenDialog(false);
              setEditingCategoryId(null);
            }}
            sx={{ color: "#DA9F5B" }}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={
              editingCategoryId ? handleUpdateCategory : handleCreateCategory
            }
            disabled={!newCategory}
            sx={{
              backgroundColor: "#DA9F5B",
              color: "white",
              "&:hover": {
                backgroundColor: "#c48f51",
              },
            }}
          >
            {editingCategoryId ? t("update") : t("create")}
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default CreateMenu;
