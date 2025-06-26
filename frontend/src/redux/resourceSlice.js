import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import i18next from "i18next";

const API_URL = import.meta.env.VITE_API_URL;

const dispatchToast = (message, type) => {
  toast[type](message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    style:
      type === "error"
        ? {
            backgroundColor: "#FFF1F0",
            color: "#FF4D4F",
            borderLeft: "4px solid #FF4D4F",
          }
        : undefined,
  });
};

// Async thunks
export const fetchResources = createAsyncThunk(
  "resource/fetchResources",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/resources`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchResourcesByCategory = createAsyncThunk(
  "resource/fetchResourcesByCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/resources/category/${categoryId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchResourcesForMenuCategory = createAsyncThunk(
  "resource/fetchResourcesForMenuCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_URL}/resources/menu-category/${categoryId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createResource = createAsyncThunk(
  "resource/createResource",
  async (resourceData, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().user;

      const response = await axios.post(`${API_URL}/resources`, resourceData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateResource = createAsyncThunk(
  "resource/updateResource",
  async ({ id, resourceData }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().user;

      const response = await axios.put(
        `${API_URL}/resources/${id}`,
        resourceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteResource = createAsyncThunk(
  "resource/deleteResource",
  async (id, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().user;

      await axios.delete(`${API_URL}/resources/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const restockResource = createAsyncThunk(
  "resource/restockResource",
  async ({ id, quantity }, { rejectWithValue, getState }) => {
    try {
      const { token } = getState().user;

      const response = await axios.patch(
        `${API_URL}/resources/${id}/restock`,
        {
          quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchLowStockResources = createAsyncThunk(
  "resource/fetchLowStockResources",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/resources/low-stock`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const resourceSlice = createSlice({
  name: "resource",
  initialState: {
    resources: [],
    categoryResources: [], // Resources for selected menu category
    lowStockResources: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearCategoryResources: (state) => {
      state.categoryResources = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch resources
      .addCase(fetchResources.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.resources = action.payload.data.resources;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Failed to fetch resources";
        dispatchToast(state.error, "error");
      })

      // Fetch resources for menu category
      .addCase(fetchResourcesForMenuCategory.fulfilled, (state, action) => {
        state.categoryResources = action.payload.data.resources;
      })

      // Create resource
      .addCase(createResource.fulfilled, (state, action) => {
        state.resources.push(action.payload.data.resource);
        dispatchToast(i18next.t("resource_created_successfully"), "success");
      })
      .addCase(createResource.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to create resource";
        dispatchToast(state.error, "error");
      })

      // Update resource
      .addCase(updateResource.fulfilled, (state, action) => {
        const updatedResource = action.payload.data.resource;
        state.resources = state.resources.map((resource) =>
          resource._id === updatedResource._id ? updatedResource : resource
        );
        dispatchToast(i18next.t("resource_updated_successfully"), "success");
      })
      .addCase(updateResource.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to update resource";
        dispatchToast(state.error, "error");
      })

      // Delete resource
      .addCase(deleteResource.fulfilled, (state, action) => {
        state.resources = state.resources.filter(
          (resource) => resource._id !== action.payload
        );
        dispatchToast(i18next.t("resource_deleted_successfully"), "success");
      })
      .addCase(deleteResource.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to delete resource";
        dispatchToast(state.error, "error");
      })

      // Restock resource
      .addCase(restockResource.fulfilled, (state, action) => {
        const restockedResource = action.payload.data.resource;
        state.resources = state.resources.map((resource) =>
          resource._id === restockedResource._id ? restockedResource : resource
        );
        dispatchToast(
          action.payload.message ||
            i18next.t("resource_restocked_successfully"),
          "success"
        );
      })
      .addCase(restockResource.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to restock resource";
        dispatchToast(state.error, "error");
      })

      // Fetch low stock resources
      .addCase(fetchLowStockResources.fulfilled, (state, action) => {
        state.lowStockResources = action.payload.data.resources;
      });
  },
});

export const { clearCategoryResources } = resourceSlice.actions;
export default resourceSlice.reducer;
