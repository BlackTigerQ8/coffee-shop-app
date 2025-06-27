// Form configurations for different entity types
export const getMenuItemFormConfig = (categories = [], resources = [], t) => ({
  fields: [
    {
      name: "name",
      label: t("name"),
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: t("description"),
      type: "textarea",
      required: true,
      rows: 3,
    },
    {
      name: "price",
      label: t("price"),
      type: "number",
      required: true,
      min: 0,
      step: 0.001,
      unit: "KWD",
    },
    {
      name: "category",
      label: t("category"),
      type: "select",
      required: true,
      options: categories.map((category) => ({
        value: typeof category === "object" ? category._id : category,
        label: typeof category === "object" ? category.name : category,
      })),
    },
    {
      name: "ingredients",
      label: t("ingredients"),
      type: "ingredients",
      required: true,
      resources: resources,
    },
    {
      name: "preparationTime",
      label: t("preparation_time"),
      type: "number",
      required: true,
      min: 1,
      step: 1,
      unit: t("minutes"),
    },
    {
      name: "image",
      label: t("image"),
      type: "file",
      accept: "image/*",
      helperText: t("select_image"),
    },
  ],
  validationRules: {
    price: { min: 0 },
  },
});

export const getCategoryFormConfig = (t) => ({
  fields: [
    {
      name: "name",
      label: t("name"),
      type: "text",
      required: true,
    },
  ],
  validationRules: {},
});

export const getResourceFormConfig = (categories = [], t) => {
  const units = ["ml", "g", "kg", "l", "pieces", "shots", "cups", "oz"];

  return {
    fields: [
      {
        name: "name",
        label: t("resource_name"),
        type: "text",
        required: true,
      },
      {
        name: "category",
        label: t("category"),
        type: "select",
        required: true,
        options: categories.map((category) => ({
          value: category._id,
          label: category.name,
        })),
      },
      {
        name: "unit",
        label: t("unit"),
        type: "select",
        required: true,
        options: units.map((unit) => ({
          value: unit,
          label: unit,
        })),
      },
      {
        name: "currentStock",
        label: t("current_stock"),
        type: "number",
        required: true,
        min: 0,
        step: 0.01,
      },
      {
        name: "minimumStock",
        label: t("minimum_stock"),
        type: "number",
        required: true,
        min: 0,
        step: 0.01,
      },
      {
        name: "costPerUnit",
        label: t("cost_per_unit"),
        type: "number",
        required: true,
        min: 0,
        step: 0.01,
        unit: "KWD",
      },
      {
        name: "supplier",
        label: t("supplier"),
        type: "text",
      },
    ],
    validationRules: {
      currentStock: { min: 0 },
      minimumStock: { min: 0 },
      costPerUnit: { min: 0 },
    },
  };
};

export const getRestockFormConfig = (resource, t) => ({
  fields: [
    {
      name: "quantity",
      label: t("quantity_to_add"),
      type: "number",
      required: true,
      min: 0,
      step: 0.01,
      unit: resource?.unit,
      helperText: `${t("current_stock")}: ${resource?.currentStock} ${
        resource?.unit
      }`,
    },
  ],
  validationRules: {
    quantity: { min: 0.01 },
  },
});
