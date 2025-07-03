import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import i18next from "i18next";

const API_URL = import.meta.env.VITE_API_URL;

// Initialize state from localStorage
const getInitialState = () => {
  const token = localStorage.getItem("token");
  const userInfo = localStorage.getItem("userInfo");

  return {
    userInfo: userInfo ? JSON.parse(userInfo) : null,
    status: "",
    token: token || "",
    userRole: userInfo ? JSON.parse(userInfo).role : "",
  };
};

const initialState = getInitialState();

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

// Thunk action for user registration
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (userFormData, { getState }) => {
    try {
      // Inside the code where you make API requests
      const { token } = getState().user;

      const response = await axios.post(`${API_URL}/users`, userFormData, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "", // Add proper formatting
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message || error.message);
    }
  }
);

// Thunk action for user login
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/users/login`, credentials);
      return response.data;
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
      }
      throw new Error(error.response.data.message || error.message);
    }
  }
);

// Thunk action for profile image upload
export const profileImage = createAsyncThunk(
  "user/profileImage",
  async (imageFile) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", imageFile);
    try {
      const response = await axios.post(`${API_URL}/upload/images`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message || error.message);
    }
  }
);

export const submitContactForm = createAsyncThunk(
  "user/submitContactForm",
  async (formData) => {
    try {
      const response = await axios.post(`${API_URL}/users/contact`, formData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.userInfo = action.payload.userInfo;
      state.userRole = action.payload.user.role;
      state.token = action.payload.token;
      // Save to localStorage
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("userInfo", JSON.stringify(action.payload.userInfo));
    },
    updateUserInfo(state, action) {
      state.userInfo = action.payload;
      // Update localStorage
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logoutUser(state) {
      state.userInfo = null;
      state.userRole = "";
      state.token = "";
      state.status = "";
      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      dispatchToast(i18next.t("loggedOut"), "success");
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { user } = action.payload.data;
        state.userInfo = user;
        state.token = action.payload.token;
        state.userRole = user.role;
        // Save to localStorage
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("userInfo", JSON.stringify(user));
        dispatchToast(i18next.t("loginUserFulfilled"), "success");
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
        dispatchToast(i18next.t(state.error), "error");
      })

      ///////////////////
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
        dispatchToast(i18next.t("registerUserFulfilled"), "success");
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        dispatchToast(i18next.t(state.error), "error");
      })
      .addCase(profileImage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userProfileImage = action.payload.file;
        dispatchToast(i18next.t("profileImageFulfilled"), "success");
      })
      .addCase(profileImage.rejected, (state) => {
        state.status = "failed";
        dispatchToast(i18next.t("profileImageRejected"), "error");
      })
      .addCase(submitContactForm.pending, (state) => {
        state.status = "loading";
      })
      .addCase(submitContactForm.fulfilled, (state) => {
        state.status = "succeeded";
        dispatchToast(i18next.t("messageSent"), "success");
      })
      .addCase(submitContactForm.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
        dispatchToast(i18next.t("messageError"), "error");
      });
  },
});

export const { logoutUser, setUser, updateUserInfo } = userSlice.actions;
export default userSlice.reducer;
