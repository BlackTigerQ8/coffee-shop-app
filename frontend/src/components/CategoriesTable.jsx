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
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import Table from "./Table";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  fetchCategories,
} from "../redux/categorySlice";

// Category Form Component
const CategoryForm = ({ category, onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [name, setName] = useState(category?.name || "");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t("name_required"));
      return;
    }
    onSubmit({ name }, category?._id);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        fullWidth
        margin="normal"
        label={t("name")}
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={!!error}
        helperText={error}
      />
      <DialogActions>
        <Button onClick={onCancel}>{t("cancel")}</Button>
        <Button type="submit" variant="contained" color="primary">
          {category ? t("update") : t("add")}
        </Button>
      </DialogActions>
    </form>
  );
};

const CategoriesTable = React.forwardRef(
  ({ categories, setIsLoading }, ref) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [modalOpen, setModalOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    // Filter and pagination logic
    const getFilteredCategories = () => {
      if (!search.trim()) {
        return categories;
      }
      return categories.filter((category) =>
        category.name.toLowerCase().includes(search.toLowerCase())
      );
    };

    const filteredCategories = getFilteredCategories();
    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);

    const getCurrentPageCategories = () => {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filteredCategories.slice(startIndex, endIndex);
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
      setCurrentCategory(null);
      setModalOpen(true);
    };

    // Expose the handleAdd function to parent component
    React.useImperativeHandle(ref, () => ({
      openAddModal: handleAdd,
    }));

    const handleEdit = (category) => {
      setCurrentCategory(category);
      setModalOpen(true);
    };

    const handleDelete = (category) => {
      setCategoryToDelete(category);
      setDeleteDialogOpen(true);
    };

    const handleSubmit = async (formData, id) => {
      setIsLoading(true);
      try {
        if (id) {
          await dispatch(updateCategory({ id: id, name: formData.name }));
        } else {
          await dispatch(createCategory(formData.name));
        }
        setModalOpen(false);
        dispatch(fetchCategories());
      } catch (error) {
        console.error("Error saving category:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleDeleteConfirm = async () => {
      if (categoryToDelete) {
        await dispatch(deleteCategory(categoryToDelete._id));
        setDeleteDialogOpen(false);
        setCategoryToDelete(null);
      }
    };

    // Table columns
    const columns = [
      { header: t("name"), accessor: "name" },
      { header: t("actions"), accessor: "actions", className: "w-1/4" },
    ];

    // Render table row
    const renderRow = (category) => (
      <tr
        key={category._id}
        className="border-b border-gray-700 hover:bg-[#8b73585d] group"
      >
        <td className="p-4 text-dark">{category.name}</td>
        <td className="p-4">
          <IconButton
            onClick={() => handleEdit(category)}
            sx={{ color: "#DA9F5B" }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(category)}
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
            placeholder={t("search_categories")}
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
          data={getCurrentPageCategories()}
          renderRow={renderRow}
        />

        {/* Pagination */}
        <Stack spacing={2} sx={{ mt: 3, alignItems: "center" }}>
          <Typography sx={{ color: "#DA9F5B" }}>
            {t("showing")}{" "}
            {Math.min((page - 1) * itemsPerPage + 1, filteredCategories.length)}{" "}
            - {Math.min(page * itemsPerPage, filteredCategories.length)}{" "}
            {t("of")} {filteredCategories.length} {t("categories")}
            {search && (
              <span>
                {" "}
                ({t("filtered_from")} {categories.length} {t("total")})
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
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {currentCategory ? t("edit_category") : t("add_category")}
          </DialogTitle>
          <DialogContent>
            <CategoryForm
              category={currentCategory}
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
                item: categoryToDelete?.name,
                type: t("category"),
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

export default CategoriesTable;
