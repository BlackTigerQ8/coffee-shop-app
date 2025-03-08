import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { FaUser, FaEnvelope, FaLock, FaPhone } from "react-icons/fa";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import {
  TextField,
  InputAdornment,
  Button,
  Tabs,
  Tab,
  IconButton,
  useMediaQuery,
  Backdrop,
  Box,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser, setUser } from "../redux/userSlice";
import { fetchUsers } from "../redux/usersSlice";
import { hourglass } from "ldrs";

const UserAuthPage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const savedToken = localStorage.getItem("token");
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // States
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const initialValues = {
    firstName: "",
    lastName: "",
    phone: "",
    dateOfBirth: "",
    email: "",
    role: "Customer",
    password: "",
    confirmPassword: "",
  };

  // Selectors
  const { userInfo, status, error } = useSelector((state) => state.user);
  const { users } = useSelector((state) => state.users);

  const phoneRegExp = /^(?=([0-9\-\+])*?[0-9]{8,9}$)[\d\-\+]+$/;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    if (isLogin) {
      // Handle login
      try {
        const result = await dispatch(
          loginUser({
            emailOrPhone: data.email,
            password: data.password,
          })
        ).unwrap();

        if (result.status === "Success") {
          navigate("/");
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    } else {
      // Handle registration
      setIsCreating(true);
      try {
        const userData = {
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          phone: data.phone,
          dateOfBirth: data.dateOfBirth,
          password: data.password,
          confirmPassword: data.confirmPassword,
          role: "Customer", // Set default role as Customer
        };

        const result = await dispatch(registerUser(userData)).unwrap();

        if (result.status === "Success") {
          // After successful registration, automatically log in
          await dispatch(
            loginUser({
              emailOrPhone: data.email,
              password: data.password,
            })
          ).unwrap();

          navigate("/");
        }
      } catch (error) {
        console.error("Registration failed:", error);
      } finally {
        setIsCreating(false);
      }
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      if (savedToken) {
        const savedUser = JSON.parse(localStorage.getItem("userInfo"));
        if (savedUser) {
          dispatch(setUser(savedUser));
        }
      }
      setIsLoading(false);
    };

    checkUser();
  }, [dispatch, savedToken]);

  useEffect(() => {
    dispatch(fetchUsers(savedToken));
  }, [dispatch, savedToken]);

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.2 },
    },
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      color: "white",
      "& fieldset": {
        borderColor: "#DA9F5B",
      },
      "&:hover fieldset": {
        borderColor: "#c48f51",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#DA9F5B",
      },
      "& input::placeholder": {
        color: "rgba(255, 255, 255, 0.5)",
      },
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255, 255, 255, 0.7)",
      "&.Mui-focused": {
        color: "#DA9F5B",
      },
    },
    "& .MuiInputAdornment-root": {
      color: "#DA9F5B",
    },
    "& .MuiFormHelperText-root": {
      color: "#f44336",
      marginLeft: 0,
    },
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <l-hourglass
          size="40"
          bg-opacity="0.1"
          speed="1.75"
          color="black"
        ></l-hourglass>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        title={isLogin ? t("login") : t("signup")}
        subtitle={isLogin ? t("login_subtitle") : t("signup_subtitle")}
      />
      <Backdrop
        sx={{
          color: "lightgray",
          zIndex: (theme) => theme.zIndex.modal + 1,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
        open={isCreating}
      >
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
          <l-cardio size="50" stroke="4" speed="1.75" color="lightgray" />
          <Typography variant="h6" color="lightgray">
            {t("creatingUser")}
          </Typography>
        </Box>
      </Backdrop>
      <div className="flex-grow container mx-auto mb-0">
        <motion.div
          className="max-w-md mx-auto bg-secondary text-white p-8 rounded-lg my-20 relative overlay-top overlay-bottom"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          ref={ref}
        >
          <Tabs
            value={isLogin ? 0 : 1}
            onChange={(_, newValue) => setIsLogin(newValue === 0)}
            centered
            sx={{
              mb: 4,
              "& .MuiTab-root": { color: "white" },
              "& .Mui-selected": { color: "#DA9F5B !important" },
              "& .MuiTabs-indicator": { backgroundColor: "#DA9F5B" },
            }}
          >
            <Tab label={t("login")} />
            <Tab label={t("signup")} />
          </Tabs>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="first_name"
                  control={control}
                  rules={{
                    required: t("first_name_required"),
                    minLength: {
                      value: 2,
                      message: t("first_name_min_length"),
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t("first_name")}
                      error={!!errors.first_name}
                      helperText={errors.first_name?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FaUser />
                          </InputAdornment>
                        ),
                      }}
                      sx={textFieldStyles}
                    />
                  )}
                />
                <Controller
                  name="last_name"
                  control={control}
                  rules={{
                    required: t("last_name_required"),
                    minLength: {
                      value: 2,
                      message: t("last_name_min_length"),
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t("last_name")}
                      error={!!errors.last_name}
                      helperText={errors.last_name?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FaUser />
                          </InputAdornment>
                        ),
                      }}
                      sx={textFieldStyles}
                    />
                  )}
                />
                <Controller
                  name="phone"
                  control={control}
                  rules={{
                    required: t("phone_required"),
                    pattern: {
                      value: /^[0-9]{8}$/,
                      message: t("phone_invalid"),
                    },
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t("phone")}
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <FaPhone />
                          </InputAdornment>
                        ),
                      }}
                      sx={textFieldStyles}
                    />
                  )}
                />{" "}
                <Controller
                  name="dateOfBirth"
                  control={control}
                  rules={{
                    required: t("dob_required"),
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="date"
                      label={t("date_of_birth")}
                      error={!!errors.dateOfBirth}
                      helperText={errors.dateOfBirth?.message}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={textFieldStyles}
                    />
                  )}
                />
              </div>
            )}

            <Controller
              name="email"
              control={control}
              rules={{
                required: t("email_required"),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: t("email_invalid"),
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t("email_placeholder")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaEnvelope />
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{
                required: t("password_required"),
                minLength: {
                  value: 6,
                  message: t("password_min_length"),
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type={showPassword ? "text" : "password"}
                  label={t("password_placeholder")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaLock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: "#DA9F5B" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={textFieldStyles}
                />
              )}
            />

            {!isLogin && (
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  required: t("confirm_password_required"),
                  validate: (value) =>
                    value === watch("password") || t("passwords_do_not_match"),
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type={showConfirmPassword ? "text" : "password"}
                    label={t("confirm_password_placeholder")}
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <FaLock />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge="end"
                            sx={{ color: "#DA9F5B" }}
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={textFieldStyles}
                  />
                )}
              />
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                backgroundColor: "#DA9F5B",
                py: 1.5,
                "&:hover": {
                  backgroundColor: "#c48f51",
                },
              }}
            >
              {isLogin ? t("login") : t("signup")}
            </Button>

            {isLogin && (
              <div className="text-center">
                <Button
                  sx={{
                    color: "#DA9F5B",
                    "&:hover": {
                      backgroundColor: "rgba(218, 159, 91, 0.04)",
                    },
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  {t("forgot_password")}
                </Button>
              </div>
            )}
          </form>

          <div className="text-center mt-6">
            <span className="mr-2">
              {isLogin ? t("dont_have_account") : t("already_have_account")}
            </span>
            <Button
              sx={{
                color: "#DA9F5B",
                "&:hover": {
                  backgroundColor: "rgba(218, 159, 91, 0.04)",
                },
              }}
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? t("signup") : t("login")}
            </Button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default UserAuthPage;
