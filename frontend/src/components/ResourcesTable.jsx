import React, { useState, useEffect } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Alert,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import Table from "./Table";
import Form from "./Form";
import StyledDialog, {
  StyledDialogContent,
  StyledDialogActions,
} from "./StyledDialog";
import { getResourceFormConfig, getRestockFormConfig } from "./formConfigs";
import {
  fetchResources,
  createResource,
  updateResource,
  deleteResource,
  restockResource,
  fetchLowStockResources,
} from "../redux/resourceSlice";

const ResourcesTable = React.forwardRef(
  ({ categories = [], setIsLoading }, ref) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { resources, lowStockResources } = useSelector(
      (state) => state.resource
    );

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [page, setPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [modalOpen, setModalOpen] = useState(false);
    const [restockModalOpen, setRestockModalOpen] = useState(false);
    const [currentResource, setCurrentResource] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [resourceToDelete, setResourceToDelete] = useState(null);

    useEffect(() => {
      dispatch(fetchResources());
      dispatch(fetchLowStockResources());
    }, [dispatch]);

    // Filter and pagination logic
    const getFilteredResources = () => {
      let filtered = resources;

      if (search.trim()) {
        filtered = filtered.filter(
          (resource) =>
            resource.name.toLowerCase().includes(search.toLowerCase()) ||
            resource.category?.name
              ?.toLowerCase()
              .includes(search.toLowerCase()) ||
            resource.supplier?.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (categoryFilter) {
        filtered = filtered.filter(
          (resource) => resource.category?._id === categoryFilter
        );
      }

      return filtered;
    };

    const filteredResources = getFilteredResources();
    const totalPages = Math.ceil(filteredResources.length / itemsPerPage);

    const getCurrentPageResources = () => {
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return filteredResources.slice(startIndex, endIndex);
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

    const handleCategoryFilter = (event) => {
      setCategoryFilter(event.target.value);
      setPage(1);
    };

    const handlePageChange = (event, value) => {
      setPage(value);
    };

    const handleAdd = () => {
      setCurrentResource(null);
      setModalOpen(true);
    };

    const handleEdit = (resource) => {
      setCurrentResource(resource);
      setModalOpen(true);
    };

    const handleRestock = (resource) => {
      setCurrentResource(resource);
      setRestockModalOpen(true);
    };

    const handleDelete = (resource) => {
      setResourceToDelete(resource);
      setDeleteDialogOpen(true);
    };

    const handleSubmit = async (formData, id) => {
      setIsLoading(true);
      try {
        if (id) {
          await dispatch(updateResource({ id, resourceData: formData }));
        } else {
          await dispatch(createResource(formData));
        }
        setModalOpen(false);
        dispatch(fetchResources());
        dispatch(fetchLowStockResources());
      } catch (error) {
        console.error("Error saving resource:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleRestockSubmit = async (quantity) => {
      setIsLoading(true);
      try {
        await dispatch(restockResource({ id: currentResource._id, quantity }));
        setRestockModalOpen(false);
        dispatch(fetchResources());
        dispatch(fetchLowStockResources());
      } catch (error) {
        console.error("Error restocking resource:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const handleDeleteConfirm = async () => {
      if (resourceToDelete) {
        await dispatch(deleteResource(resourceToDelete._id));
        setDeleteDialogOpen(false);
        setResourceToDelete(null);
        dispatch(fetchResources());
        dispatch(fetchLowStockResources());
      }
    };

    // Prepare form data for editing
    const getInitialResourceFormData = (resource) => {
      if (!resource) return {};

      return {
        _id: resource?._id,
        name: resource.name || "",
        category: resource.category?._id || resource.category || "",
        unit: resource.unit || "",
        currentStock: resource.currentStock || "",
        minimumStock: resource.minimumStock || "",
        costPerUnit: resource.costPerUnit || "",
        supplier: resource.supplier || "",
      };
    };

    const getInitialRestockFormData = () => ({
      quantity: "",
    });

    // Get form configurations
    const resourceFormConfig = getResourceFormConfig(categories, t);
    const restockFormConfig = getRestockFormConfig(currentResource, t);

    // Expose the handleAdd function to parent component
    React.useImperativeHandle(ref, () => ({
      openAddModal: handleAdd,
    }));

    // Table columns
    const columns = [
      { header: t("name"), accessor: "name" },
      { header: t("category"), accessor: "category" },
      { header: t("current_stock"), accessor: "currentStock" },
      { header: t("minimum_stock"), accessor: "minimumStock" },
      { header: t("unit"), accessor: "unit" },
      { header: t("cost_per_unit"), accessor: "costPerUnit" },
      { header: t("supplier"), accessor: "supplier" },
      { header: t("status"), accessor: "status" },
      { header: t("actions"), accessor: "actions", className: "w-1/4" },
    ];

    // Render table row
    const renderRow = (resource) => {
      const isLowStock = resource.currentStock <= resource.minimumStock;

      return (
        <tr
          key={resource._id}
          className={`border-b border-gray-700 hover:bg-[#8b73585d] group ${
            isLowStock ? "bg-red-50" : ""
          }`}
        >
          <td className="p-4 text-dark font-medium">{resource.name}</td>
          <td className="p-4 text-dark">
            {resource.category?.name || "No Category"}
          </td>
          <td className="p-4 text-dark">
            <span className={isLowStock ? "text-red-600 font-bold" : ""}>
              {resource.currentStock}
            </span>
          </td>
          <td className="p-4 text-dark">{resource.minimumStock}</td>
          <td className="p-4 text-dark">{resource.unit}</td>
          <td className="p-4 text-dark">
            {resource.costPerUnit.toFixed(3)} KWD
          </td>
          <td className="p-4 text-dark">{resource.supplier || "-"}</td>
          <td className="p-4">
            {isLowStock ? (
              <Chip
                icon={<WarningIcon />}
                label={t("low_stock")}
                color="error"
                size="small"
              />
            ) : (
              <Chip label={t("in_stock")} color="success" size="small" />
            )}
          </td>
          <td className="p-4">
            <IconButton
              onClick={() => handleRestock(resource)}
              sx={{ color: "#4CAF50" }}
              title={t("restock")}
            >
              <AddIcon />
            </IconButton>
            <IconButton
              onClick={() => handleEdit(resource)}
              sx={{ color: "#DA9F5B" }}
              title={t("edit")}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => handleDelete(resource)}
              sx={{ color: "error.main" }}
              title={t("delete")}
            >
              <DeleteIcon />
            </IconButton>
          </td>
        </tr>
      );
    };

    return (
      <>
        {/* Low Stock Alert */}
        {lowStockResources.length > 0 && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="body2">
              {t("low_stock_alert", { count: lowStockResources.length })}
            </Typography>
          </Alert>
        )}

        {/* Search and Filter Bar */}
        <Box sx={{ mb: 3, display: "flex", gap: 2 }}>
          <TextField
            fullWidth
            placeholder={t("search_resources")}
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

          <FormControl
            sx={{
              minWidth: 200,
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#DA9F5B" },
                "&:hover fieldset": { borderColor: "#c48f51" },
                "&.Mui-focused fieldset": {
                  borderColor: "#DA9F5B",
                },
              },
              "& .MuiInputLabel-root": {
                "&.Mui-focused": {
                  color: "#DA9F5B",
                },
              },
            }}
          >
            <InputLabel>{t("filter_by_category")}</InputLabel>
            <Select
              value={categoryFilter}
              onChange={handleCategoryFilter}
              label={t("filter_by_category")}
            >
              <MenuItem value="">
                <em>{t("all_categories")}</em>
              </MenuItem>
              {categories.map((category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Table */}
        <Table
          columns={columns}
          data={getCurrentPageResources()}
          renderRow={renderRow}
        />

        {/* Pagination */}
        <Stack spacing={2} sx={{ mt: 3, alignItems: "center" }}>
          <Typography sx={{ color: "#DA9F5B" }}>
            {t("showing")}{" "}
            {Math.min((page - 1) * itemsPerPage + 1, filteredResources.length)}{" "}
            - {Math.min(page * itemsPerPage, filteredResources.length)}{" "}
            {t("of")} {filteredResources.length} {t("resources")}
            {(search || categoryFilter) && (
              <span>
                {" "}
                ({t("filtered_from")} {resources.length} {t("total")})
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
          title={currentResource ? t("edit_resource") : t("add_resource")}
          maxWidth="md"
          fullWidth
        >
          <StyledDialogContent>
            <Form
              {...resourceFormConfig}
              initialValues={getInitialResourceFormData(currentResource)}
              onSubmit={handleSubmit}
              onCancel={() => setModalOpen(false)}
              isEdit={!!currentResource}
            />
          </StyledDialogContent>
        </StyledDialog>

        {/* Restock Dialog */}
        <StyledDialog
          open={restockModalOpen}
          onClose={() => setRestockModalOpen(false)}
          title={`${t("restock_resource")}: ${currentResource?.name}`}
          maxWidth="sm"
          fullWidth
        >
          <StyledDialogContent>
            <Form
              {...restockFormConfig}
              initialValues={getInitialRestockFormData()}
              onSubmit={(formData) => handleRestockSubmit(formData.quantity)}
              onCancel={() => setRestockModalOpen(false)}
              submitLabel={t("restock")}
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
                item: resourceToDelete?.name,
                type: t("resource"),
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

export default ResourcesTable;
