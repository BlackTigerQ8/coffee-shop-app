import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import i18next from "i18next";

const API_URL = import.meta.env.VITE_API_URL;

const initialState = {
  users: [],
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
  });
};

export const fetchUsers = createAsyncThunk("user/fetchUsers", async (token) => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message || error.message);
  }
});

export const checkPhoneExists = createAsyncThunk(
  "users/checkPhoneExists",
  async (phone, { getState }) => {
    try {
      const token = getState().user.token;
      const response = await axios.get(
        `${API_URL}/users/check-phone/${phone}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error checking phone:", error);
      return false;
    }
  }
);

export const checkEmailExists = createAsyncThunk(
  "users/checkEmailExists",
  async (email, { getState }) => {
    try {
      const token = getState().user.token;
      const response = await axios.get(
        `${API_URL}/users/check-email/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error checking email:", error);
      return false;
    }
  }
);

export const fetchUsersByRole = createAsyncThunk(
  "user/fetchUsersByRole",
  async (role, token) => {
    try {
      const response = await axios.get(`${API_URL}/users?role=${role}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message || error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (userId, { getState }) => {
    try {
      const token = getState().user.token;
      const response = await axios.delete(`${API_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message || error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ userId, formData }, { getState }) => {
    try {
      const token = getState().user.token;
      const response = await axios.put(`${API_URL}/users/${userId}`, formData, {
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

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload.data.users;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
    // delete user
    builder
      .addCase(deleteUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const deletedUserId = action.meta.arg;
        state.status = "succeeded";
        state.users = state.users.filter((user) => user._id !== deletedUserId);
        dispatchToast(i18next.t("deleteUserFulfilled"), "success");
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        dispatchToast(i18next.t("deleteUserRejected"), "error");
      });
    // update user
    builder
      .addCase(updateUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        const updatedUser = action.payload.data.user;
        state.users = state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
        dispatchToast(i18next.t("updateUserFulfilled"), "success");
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        dispatchToast(i18next.t("updateUserRejected"), "error");
      });
    // fetch users by role
    builder
      .addCase(fetchUsersByRole.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsersByRole.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload.data.users;
      })
      .addCase(fetchUsersByRole.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default usersSlice.reducer;
