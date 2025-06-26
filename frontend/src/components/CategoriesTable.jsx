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
  Button,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import Table from "./Table";
import Form from "./Form";
import StyledDialog, {
  StyledDialogContent,
  StyledDialogActions,
} from "./StyledDialog";
import { getCategoryFormConfig } from "./formConfigs";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  fetchCategories,
} from "../redux/categorySlice";

const CategoriesTable = React.forwardRef(
  ({ categories = [], setIsLoading }, ref) => {
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

    // Prepare form data for editing
    const getInitialFormData = (category) => {
      if (!category) return {};
      return {
        _id: category?._id,
        name: category.name || "",
      };
    };

    // Get form configuration
    const formConfig = getCategoryFormConfig(t);

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
        <StyledDialog
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title={currentCategory ? t("edit_category") : t("add_category")}
          maxWidth="sm"
          fullWidth
        >
          <StyledDialogContent>
            <Form
              {...formConfig}
              initialValues={getInitialFormData(currentCategory)}
              onSubmit={handleSubmit}
              onCancel={() => setModalOpen(false)}
              isEdit={!!currentCategory}
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
                item: categoryToDelete?.name,
                type: t("category"),
              })}
            </Typography>
          </StyledDialogContent>
          <StyledDialogActions>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              sx={{
                color: "#33211D",
                "&:hover": {
                  backgroundColor: "rgba(51, 33, 29, 0.1)",
                },
              }}
            >
              {t("cancel")}
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              sx={{
                backgroundColor: "#d32f2f",
                color: "white",
                "&:hover": {
                  backgroundColor: "#b71c1c",
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

export default CategoriesTable;
