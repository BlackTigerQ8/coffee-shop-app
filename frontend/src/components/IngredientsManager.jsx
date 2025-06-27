import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const IngredientsManager = ({ resources, value = [], onChange }) => {
  const { t } = useTranslation();
  const [selectedResource, setSelectedResource] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleAddIngredient = () => {
    if (!selectedResource || !quantity) return;

    const resource = resources.find((r) => r._id === selectedResource);
    if (!resource) return;

    // Check if the resource is already in the ingredients list
    const isDuplicate = value.some(
      (ingredient) => ingredient.resource === selectedResource
    );

    if (isDuplicate) {
      // Show error toast if resource is already added
      toast.error(t("resource_already_added", { name: resource.name }), {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        style: {
          backgroundColor: "#FFF1F0",
          color: "#FF4D4F",
          borderLeft: "4px solid #FF4D4F",
        },
      });
      return;
    }

    const newIngredient = {
      resource: selectedResource,
      quantity: parseFloat(quantity),
      // Add these for display purposes
      resourceName: resource.name,
      unit: resource.unit,
    };

    onChange([...value, newIngredient]);
    setSelectedResource("");
    setQuantity("");
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = value.filter((_, i) => i !== index);
    onChange(newIngredients);
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ mb: 2 }}>
        {t("ingredients")}
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={5}>
          <FormControl fullWidth>
            <InputLabel>{t("resource")}</InputLabel>
            <Select
              value={selectedResource}
              onChange={(e) => setSelectedResource(e.target.value)}
              label={t("resource")}
            >
              {resources.map((resource) => (
                <MenuItem key={resource._id} value={resource._id}>
                  {resource.name} ({resource.currentStock} {resource.unit})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={5}>
          <TextField
            fullWidth
            type="number"
            label={t("quantity")}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            InputProps={{
              inputProps: { min: 0, step: 0.01 },
            }}
          />
        </Grid>

        <Grid item xs={12} sm={2}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleAddIngredient}
            disabled={!selectedResource || !quantity}
            sx={{ height: "100%" }}
          >
            <AddIcon />
          </Button>
        </Grid>
      </Grid>

      <List>
        {value.map((ingredient, index) => (
          <ListItem key={index} divider>
            <ListItemText
              primary={`${ingredient.resourceName}`}
              secondary={`${ingredient.quantity} ${ingredient.unit}`}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                onClick={() => handleRemoveIngredient(index)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default IngredientsManager;
