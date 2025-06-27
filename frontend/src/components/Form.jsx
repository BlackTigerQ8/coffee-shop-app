// frontend/src/components/DynamicForm.jsx
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  DialogActions,
  InputAdornment,
} from "@mui/material";

const Form = ({
  fields,
  initialValues = {},
  onSubmit,
  onCancel,
  submitLabel,
  cancelLabel,
  validationRules = {},
  isEdit = false,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({});

  // Update form data when initialValues change (for edit mode)
  useEffect(() => {
    setFormData(initialValues);
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    // Only handle files if it's actually a file input AND files exist
    if (type === "file" && files?.length > 0) {
      setFormData((prev) => ({
        ...prev,
        image: files[0], // Always use "image" as the key for file uploads
      }));
    } else {
      // For all other input types, use the regular value
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};

    fields.forEach((field) => {
      const value = formData[field.name];

      // Required field validation
      if (
        field.required &&
        (!value || (typeof value === "string" && !value.trim()))
      ) {
        newErrors[field.name] =
          t(`${field.name}_required`) || `${field.label} is required`;
      }

      // Custom validation rules
      if (validationRules[field.name] && value) {
        const rule = validationRules[field.name];
        if (rule.min && parseFloat(value) < rule.min) {
          newErrors[field.name] =
            t(`${field.name}_min_error`) ||
            `${field.label} must be at least ${rule.min}`;
        }
        if (rule.max && parseFloat(value) > rule.max) {
          newErrors[field.name] =
            t(`${field.name}_max_error`) ||
            `${field.label} must be at most ${rule.max}`;
        }
        if (rule.pattern && !rule.pattern.test(value)) {
          newErrors[field.name] =
            t(`${field.name}_pattern_error`) ||
            `${field.label} format is invalid`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Check if we need to create FormData (for file uploads)
      const hasFileField = fields.some((field) => field.type === "file");

      if (hasFileField) {
        const formDataObj = new FormData();
        Object.keys(formData).forEach((key) => {
          if (formData[key] !== null && formData[key] !== undefined) {
            formDataObj.append(key, formData[key]);
            // Add this logging
            console.log("Appending to FormData:", key, formData[key]);
          }
        });
        onSubmit(formDataObj, initialValues._id);
      } else {
        onSubmit(formData, initialValues._id);
      }
    }
  };

  const renderField = (field) => {
    if (!field || !field.name) {
      console.warn("Invalid field configuration:", field);
      return null;
    }

    const commonProps = {
      key: field.name,
      fullWidth: true,
      margin: "normal",
      error: !!errors[field.name],
      helperText: errors[field.name] || field.helperText,
      sx: {
        "& .MuiOutlinedInput-root": {
          "&.Mui-focused fieldset": {
            borderColor: "#DA9F5B",
          },
        },
        "& .MuiInputLabel-root": {
          "&.Mui-focused": {
            color: "#DA9F5B",
          },
        },
      },
      ...field.props,
    };

    switch (field.type) {
      case "text":
      case "email":
        return (
          <TextField
            {...commonProps}
            label={field.label}
            name={field.name}
            type={field.type}
            value={formData[field.name] || ""}
            onChange={handleChange}
          />
        );

      case "number":
        return (
          <TextField
            {...commonProps}
            label={field.label}
            name={field.name}
            type="number"
            value={formData[field.name] || ""}
            onChange={handleChange}
            InputProps={{
              inputProps: {
                min: field.min || 0,
                step: field.step || 0.01,
              },
              endAdornment: field.unit && (
                <InputAdornment position="end">{field.unit}</InputAdornment>
              ),
            }}
          />
        );

      case "textarea":
        return (
          <TextField
            {...commonProps}
            label={field.label}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
            multiline
            rows={field.rows || 3}
          />
        );

      case "select":
        return (
          <FormControl {...commonProps}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              name={field.name}
              value={formData[field.name] || ""}
              onChange={handleChange}
              label={field.label}
            >
              {(field.options || []).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {errors[field.name] && (
              <FormHelperText>{errors[field.name]}</FormHelperText>
            )}
          </FormControl>
        );

      case "file":
        return (
          <TextField
            {...commonProps}
            type="file"
            inputProps={{ accept: field.accept || "image/*" }}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        );

      default:
        return null;
    }
  };

  if (!fields || !Array.isArray(fields)) {
    console.error("Form fields are missing or invalid:", fields);
    return (
      <div>
        <p>Form configuration error. Please check the console for details.</p>
        <DialogActions>
          <Button onClick={onCancel}>{cancelLabel || t("cancel")}</Button>
        </DialogActions>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {fields.map(renderField)}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "16px",
          marginTop: "24px",
          paddingTop: "16px",
          borderTop: "1px solid #DA9F5B",
        }}
      >
        <Button
          onClick={onCancel}
          sx={{
            color: "#FFF8F0",
            "&:hover": {
              backgroundColor: "rgba(255, 248, 240, 0.1)",
            },
          }}
        >
          {cancelLabel || t("cancel")}
        </Button>
        <Button
          type="submit"
          sx={{
            backgroundColor: "#DA9F5B",
            color: "#FFF8F0",
            "&:hover": {
              backgroundColor: "#c48f51",
            },
          }}
        >
          {submitLabel || (isEdit ? t("update") : t("add"))}
        </Button>
      </div>
    </form>
  );
};

export default Form;
