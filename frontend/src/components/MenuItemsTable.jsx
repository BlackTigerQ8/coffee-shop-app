import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Typography,
  Pagination,
  Button,
  ToggleButton,
  Tooltip,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ToggleOn as ToggleOnIcon,
  ToggleOff as ToggleOffIcon,
} from "@mui/icons-material";
import Table from "./Table";
import Form from "./Form";
import StyledDialog, {
  StyledDialogContent,
  StyledDialogActions,
} from "./StyledDialog";
import { getMenuItemFormConfig } from "./formConfigs";
import {
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  fetchMenuItems,
  toggleMenuItemAvailability,
} from "../redux/menuSlice";
import CardImg from "../assets/card.jpg";

const MenuItemsTable = React.forwardRef(
  ({ menuItems = [], categories = [], setIsLoading }, ref) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const { resources } = useSelector((state) => state.resource);

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

    const handleToggleAvailability = async (item) => {
      try {
        await dispatch(
          toggleMenuItemAvailability({
            menuId: item._id,
            isAvailable: !item.isAvailable,
          })
        );
        dispatch(fetchMenuItems());
      } catch (error) {
        console.error("Error toggling availability:", error);
      }
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

    // Prepare form data for editing
    const getInitialFormData = (item) => {
      if (!item) return {};

      // Prepare ingredients with display information
      const preparedIngredients =
        item.ingredients?.map((ingredient) => {
          // Find the full resource information from the resources array
          const resourceInfo = resources.find(
            (r) => r._id === (ingredient.resource._id || ingredient.resource)
          );

          return {
            resource: ingredient.resource._id || ingredient.resource,
            quantity: ingredient.quantity,
            resourceName: resourceInfo?.name || "",
            unit: resourceInfo?.unit || "",
          };
        }) || [];

      return {
        _id: item?._id,
        name: item.name || "",
        description: item.description || "",
        price: item.price || "",
        category:
          typeof item.category === "object"
            ? item.category?._id
            : item.category || "",
        ingredients: preparedIngredients,
        preparationTime: item.preparationTime || 0,
      };
    };

    // Get form configuration
    const formConfig = getMenuItemFormConfig(categories, resources, t);

    const handleDeleteConfirm = async () => {
      if (itemToDelete) {
        await dispatch(deleteMenuItem(itemToDelete._id));
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      }
    };

    // Table columns
    const columns = [
      { header: t("image"), accessor: "image", hideOnMobile: true },
      { header: t("name"), accessor: "name" },
      { header: t("description"), accessor: "description", hideOnMobile: true },
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
        <td className="p-4 hidden md:table-cell">
          <img
            src={`${API_URL}/${item.image}`}
            alt={item.name}
            crossOrigin="anonymous"
            onError={(e) => {
              console.error("Failed to load image:", e.target.src);
              e.target.onerror = null;
              e.target.src = CardImg;
            }}
            className="w-12 h-12 object-cover rounded "
          />
        </td>
        <td className="p-4 text-dark">{item.name}</td>
        <td className="p-4 text-dark hidden md:table-cell">
          {item.description}
        </td>
        <td className="p-4 text-dark">{item.price.toFixed(3)}KWD</td>
        <td className="p-4 text-dark">
          {item.category?.name || "No Category"}
        </td>
        <td className="p-4">
          <Tooltip title={t("edit_item")}>
            <IconButton
              onClick={() => handleEdit(item)}
              sx={{ color: "#DA9F5B" }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("delete_item")}>
            <IconButton
              onClick={() => handleDelete(item)}
              sx={{ color: "error.main" }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip
            title={item.isAvailable ? t("disable_item") : t("enable_item")}
          >
            <IconButton
              onClick={() => handleToggleAvailability(item)}
              sx={{ color: item.isAvailable ? "#4CAF50" : "#FF4D4F" }}
            >
              {item.isAvailable ? <ToggleOnIcon /> : <ToggleOffIcon />}
            </IconButton>
          </Tooltip>
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
        <StyledDialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={currentItem ? t("edit_menu_item") : t("add_menu_item")}
          maxWidth="md"
          fullWidth
        >
          <StyledDialogContent>
            <Form
              {...formConfig}
              initialValues={getInitialFormData(currentItem)}
              onSubmit={handleSubmit}
              onCancel={() => setModalOpen(false)}
              isEdit={!!currentItem}
            />
          </StyledDialogContent>
        </StyledDialog>

        {/* Delete Confirmation Dialog */}
        <StyledDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          title={t("confirm_delete")}
          maxWidth="sm"
        >
          <StyledDialogContent>
            <Typography sx={{ color: "#33211D", mb: 2 }}>
              {t("delete_confirmation_message", {
                item: itemToDelete?.name,
                type: t("menu_item"),
              })}
            </Typography>
          </StyledDialogContent>
          <StyledDialogActions>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              sx={{
                color: "#33211D",
                "&:hover": {
                  backgroundColor: "rgba(255, 248, 240, 0.1)",
                },
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              sx={{
                backgroundColor: "#dc3545",
                color: "#FFF8F0",
                "&:hover": {
                  backgroundColor: "#c82333",
                },
              }}
            >
              {t("delete")}
            </Button>
          </StyledDialogActions>
        </StyledDialog>
      </>
    );
  }
);

export default MenuItemsTable;
