import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import i18next from "i18next";

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  menuItems: [],
  status: "",
  error: null,
};

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

// Thunk action for creating a new menu item
export const createMenuItem = createAsyncThunk(
  "menu/createMenuItem",
  async (menuItemData, { getState }) => {
    try {
      const { token } = getState().user;

      const response = await axios.post(`${API_URL}/menu`, menuItemData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message || error.message);
    }
  }
);

// Thunk action for fetching all menu items
export const fetchMenuItems = createAsyncThunk(
  "menu/fetchMenuItems",
  async () => {
    try {
      const response = await axios.get(`${API_URL}/menu`);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message || error.message);
    }
  }
);

// Thunk action for updating a menu item
export const updateMenuItem = createAsyncThunk(
  "menu/updateMenuItem",
  async ({ menuId, menuItemData }, { getState }) => {
    try {
      const { token } = getState().user;

      const response = await axios.put(
        `${API_URL}/menu/${menuId}`,
        menuItemData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message || error.message);
    }
  }
);

// Thunk action for deleting a menu item
export const deleteMenuItem = createAsyncThunk(
  "menu/deleteMenuItem",
  async (menuId, { getState }) => {
    try {
      const { token } = getState().user;

      const response = await axios.delete(`${API_URL}/menu/${menuId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message || error.message);
    }
  }
);

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenuItems(state, action) {
      state.menuItems = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createMenuItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createMenuItem.fulfilled, (state) => {
        state.status = "succeeded";
        dispatchToast(i18next.t("createMenuItemFulfilled"), "success");
      })
      .addCase(createMenuItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        dispatchToast(i18next.t(state.error), "error");
      });
    // fetch menu items
    builder
      .addCase(fetchMenuItems.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.menuItems = action.payload.data.menuItems;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    // update menu item
    builder
      .addCase(updateMenuItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedMenuItem = action.payload.data.menuItem;
        state.menuItems = state.menuItems.map((item) =>
          item._id === updatedMenuItem._id ? updatedMenuItem : item
        );
        dispatchToast(i18next.t("updateMenuItemFulfilled"), "success");
      })
      .addCase(updateMenuItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        dispatchToast(i18next.t(state.error), "error");
      });
    // delete menu item
    builder
      .addCase(deleteMenuItem.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteMenuItem.fulfilled, (state, action) => {
        state.status = "succeeded";
        const deletedMenuItemId = action.meta.arg;
        state.menuItems = state.menuItems.filter(
          (item) => item._id !== deletedMenuItemId
        );
        dispatchToast(i18next.t("deleteMenuItemFulfilled"), "success");
      })
      .addCase(deleteMenuItem.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        dispatchToast(i18next.t(state.error), "error");
      });
  },
});

export const { setMenuItems } = menuSlice.actions;
export default menuSlice.reducer;
