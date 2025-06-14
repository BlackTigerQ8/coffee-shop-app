import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Typography,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import Table from "./Table";
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  fetchMenuItems,
} from "../redux/menuSlice";
import CardImg from "../assets/card.jpg";

// Menu Item Form Component
const MenuItemForm = ({ item, categories, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: item?.name || "",
    description: item?.description || "",
    price: item?.price || "",
    category:
      typeof item?.category === "object"
        ? item?.category?._id || ""
        : item?.category || "",
    image: null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = t("name_required");
    if (!formData.description)
      newErrors.description = t("description_required");
    if (!formData.price) newErrors.price = t("price_required");
    if (!formData.category) newErrors.category = t("category_required");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const menuItemData = new FormData();
      menuItemData.append("name", formData.name);
      menuItemData.append("description", formData.description);
      menuItemData.append("price", formData.price);
      menuItemData.append("category", formData.category);
      if (formData.image) {
        menuItemData.append("image", formData.image);
      }
      onSubmit(menuItemData, item?._id);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        margin="normal"
        label={t("name")}
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={!!errors.name}
        helperText={errors.name}
      />
      <TextField
        fullWidth
        margin="normal"
        label={t("description")}
        name="description"
        value={formData.description}
        onChange={handleChange}
        multiline
        rows={3}
        error={!!errors.description}
        helperText={errors.description}
      />
      <TextField
        fullWidth
        margin="normal"
        label={t("price")}
        name="price"
        type="number"
        value={formData.price}
        onChange={handleChange}
        error={!!errors.price}
        helperText={errors.price}
        InputProps={{ inputProps: { min: 0, step: 0.01 } }}
      />
      <FormControl fullWidth margin="normal" error={!!errors.category}>
        <InputLabel>{t("category")}</InputLabel>
        <Select
          name="category"
          value={formData.category}
          onChange={handleChange}
          label={t("category")}
        >
          {categories.map((category) => (
            <MenuItem key={category._id} value={category._id}>
              {category.name}
            </MenuItem>
          ))}
        </Select>
        {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
      </FormControl>
      <TextField
        fullWidth
        margin="normal"
        type="file"
        inputProps={{ accept: "image/*" }}
        onChange={handleImageChange}
        helperText={t("select_image")}
      />
      <DialogActions>
        <Button onClick={onCancel}>{t("cancel")}</Button>
        <Button type="submit" variant="contained" color="primary">
          {item ? t("update") : t("add")}
        </Button>
      </DialogActions>
    </form>
  );
};

const MenuItemsTable = React.forwardRef(
  ({ menuItems, categories, setIsLoading }, ref) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

    const API_URL = import.meta.env.VITE_API_URL;

    // Filter and pagination logic
    const getFilteredItems = () => {
      if (!search.trim()) {
        return menuItems;
      }
      return menuItems.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.description.toLowerCase().includes(search.toLowerCase()) ||
          item.category?.name?.toLowerCase().includes(search.toLowerCase())
      );
    };

    const filteredItems = getFilteredItems();
    const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

    const getCurrentPageItems = () => {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filteredItems.slice(startIndex, endIndex);
    };

    // Event handlers
    const handleSearch = (event) => {
      setSearch(event.target.value);
      setPage(1);
    };

    const clearSearch = () => {
      setSearch("");
      setPage(1);
    };

    const handlePageChange = (event, value) => {
      setPage(value);
    };

    const handleAdd = () => {
      setCurrentItem(null);
      setModalOpen(true);
    };

    // Expose the handleAdd function to parent component
    React.useImperativeHandle(ref, () => ({
      openAddModal: handleAdd,
    }));

    const handleEdit = (item) => {
      setCurrentItem(item);
      setModalOpen(true);
    };

    const handleDelete = (item) => {
      setItemToDelete(item);
      setDeleteDialogOpen(true);
    };

    const handleSubmit = async (formData, id) => {
      setIsLoading(true);
      try {
        if (id) {
          await dispatch(
            updateMenuItem({ menuId: id, menuItemData: formData })
          );
        } else {
          await dispatch(createMenuItem(formData));
        }
        setModalOpen(false);
        dispatch(fetchMenuItems());
      } catch (error) {
        console.error("Error saving menu item:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleDeleteConfirm = async () => {
      if (itemToDelete) {
        await dispatch(deleteMenuItem(itemToDelete._id));
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      }
    };

    // Table columns
    const columns = [
      { header: t("image"), accessor: "image" },
      { header: t("name"), accessor: "name" },
      { header: t("description"), accessor: "description" },
      { header: t("price"), accessor: "price" },
      { header: t("category"), accessor: "category" },
      { header: t("actions"), accessor: "actions", className: "w-1/4" },
    ];

    // Render table row
    const renderRow = (item) => (
      <tr
        key={item._id}
        className="border-b border-gray-700 hover:bg-[#8b73585d] group"
      >
        <td className="p-4">
          <img
            src={`${API_URL}/${item.image}`}
            alt={item.name}
            crossOrigin="anonymous"
            onError={(e) => {
              console.error("Failed to load image:", e.target.src);
              e.target.onerror = null;
              e.target.src = CardImg;
            }}
            className="w-12 h-12 object-cover rounded"
          />
        </td>
        <td className="p-4 text-dark">{item.name}</td>
        <td className="p-4 text-dark">{item.description}</td>
        <td className="p-4 text-dark">{item.price.toFixed(3)}KWD</td>
        <td className="p-4 text-dark">
          {item.category?.name || "No Category"}
        </td>
        <td className="p-4">
          <IconButton
            onClick={() => handleEdit(item)}
            sx={{ color: "#DA9F5B" }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(item)}
            sx={{ color: "error.main" }}
          >
            <DeleteIcon />
          </IconButton>
        </td>
      </tr>
    );

    return (
      <>
        {/* Search Bar */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder={t("search_menu_items")}
            value={search}
            onChange={handleSearch}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#DA9F5B" },
                "&:hover fieldset": { borderColor: "#c48f51" },
                "&.Mui-focused fieldset": { borderColor: "#DA9F5B" },
              },
              "& .MuiInputBase-input": { color: "black" },
              "& .MuiInputBase-input::placeholder": {
                color: "#DA9F5B",
                opacity: 0.7,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#DA9F5B" }} />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={clearSearch}
                    sx={{ color: "#DA9F5B" }}
                    size="small"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Table */}
        <Table
          columns={columns}
          data={getCurrentPageItems()}
          renderRow={renderRow}
        />

        {/* Pagination */}
        <Stack spacing={2} sx={{ mt: 3, alignItems: "center" }}>
          <Typography sx={{ color: "#DA9F5B" }}>
            {t("showing")}{" "}
            {Math.min((page - 1) * itemsPerPage + 1, filteredItems.length)} -{" "}
            {Math.min(page * itemsPerPage, filteredItems.length)} {t("of")}{" "}
            {filteredItems.length} {t("menu_items")}
            {search && (
              <span>
                {" "}
                ({t("filtered_from")} {menuItems.length} {t("total")})
              </span>
            )}
          </Typography>
          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
              sx={{
                "& .MuiPaginationItem-root": {
                  color: "#DA9F5B",
                  "&.Mui-selected": {
                    backgroundColor: "#DA9F5B",
                    color: "white",
                    "&:hover": { backgroundColor: "#c48f51" },
                  },
                  "&:hover": { backgroundColor: "rgba(218, 159, 91, 0.1)" },
                },
              }}
            />
          )}
        </Stack>

        {/* Add/Edit Dialog */}
        <Dialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {currentItem ? t("edit_menu_item") : t("add_menu_item")}
          </DialogTitle>
          <DialogContent>
            <MenuItemForm
              item={currentItem}
              categories={categories}
              onSubmit={handleSubmit}
              onCancel={() => setModalOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>{t("confirm_delete")}</DialogTitle>
          <DialogContent>
            <Typography>
              {t("delete_confirmation_message", {
                item: itemToDelete?.name,
                type: t("menu_item"),
              })}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              color="error"
              variant="contained"
            >
              {t("delete")}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
);

export default MenuItemsTable;
