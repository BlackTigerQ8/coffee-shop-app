import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaCalendar,
} from "react-icons/fa"; // Add FaCalendar import
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
} from "@mui/material";
import Backdrop from "../components/Backdrop";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser, setUser } from "../redux/userSlice";
import { checkPhoneExists, checkEmailExists } from "../redux/usersSlice";

const UserAuthPage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });
  const { token } = useSelector((state) => state.user);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const phoneRegExp = /^(?=([0-9\-\+])*?[0-9]{8,9}$)[\d\-\+]+$/;

  // States
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Selectors
  const { status } = useSelector((state) => state.user);

  const validationSchema = yup.object().shape({
    firstName: yup.string().when("isLogin", {
      is: false,
      then: () =>
        yup
          .string()
          .required(t("first_name_required"))
          .min(2, t("first_name_min_length")),
    }),
    lastName: yup.string().when("isLogin", {
      is: false,
      then: () =>
        yup
          .string()
          .required(t("last_name_required"))
          .min(2, t("last_name_min_length")),
    }),
    email: yup.string().when("isLogin", {
      is: true,
      then: () => yup.string().required(t("required")), // Simple validation for login
      otherwise: () =>
        yup
          .string()
          .email(t("email_invalid"))
          .required(t("required"))
          .test("unique", t("emailAlreadyExists"), async function (value) {
            if (!value) return true;
            const result = await dispatch(checkEmailExists(value));
            return !result.payload;
          }),
    }),
    phone: yup.string().when("isLogin", {
      is: true,
      then: () => yup.string(), // No validation during login
      otherwise: () =>
        yup
          .string()
          .required(t("phone_required"))
          .test("unique", t("phoneAlreadyExists"), async function (value) {
            if (!value) return true;
            const result = await dispatch(checkPhoneExists(value));
            return !result.payload;
          }),
    }),
    dateOfBirth: yup.string().when("isLogin", {
      is: false,
      then: () => yup.string().required(t("dob_required")),
    }),
    password: yup
      .string()
      .required(t("password_required"))
      .when("isLogin", {
        is: false,
        then: () => yup.string().min(6, t("password_min_length")),
      }),
    confirmPassword: yup.string().when("isLogin", {
      is: false,
      then: () =>
        yup
          .string()
          .required(t("confirm_password_required"))
          .oneOf([yup.ref("password")], t("passwords_do_not_match")),
    }),
  });

  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    password: "",
    confirmPassword: "",
    isLogin,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isLogin) {
        const result = await dispatch(
          loginUser({
            emailOrPhone: values.email,
            password: values.password,
          })
        ).unwrap();

        if (result.status === "Success") {
          navigate("/");
        }
      } else {
        const userData = {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          dateOfBirth: values.dateOfBirth,
          password: values.password,
          confirmPassword: values.confirmPassword,
          role: "Customer",
        };

        const result = await dispatch(registerUser(userData)).unwrap();

        if (result.status === "Success") {
          await dispatch(
            loginUser({
              emailOrPhone: values.email,
              password: values.password,
            })
          ).unwrap();
          navigate("/");
        }
      }
    } catch (error) {
      console.error(isLogin ? "Login failed:" : "Registration failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      if (token) {
        const savedUser = JSON.parse(localStorage.getItem("userInfo"));
        if (savedUser) {
          dispatch(setUser(savedUser));
          navigate("/"); // Redirect to home if already logged in
        }
      }
      setIsLoading(false);
    };

    checkUser();
  }, [dispatch, token, navigate]);

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        title={isLogin ? t("login") : t("signup")}
        subtitle={isLogin ? t("login_subtitle") : t("signup_subtitle")}
      />

      <Backdrop isOpen={isLoading} />
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

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched, isSubmitting, setFieldValue }) => (
              <Form className="space-y-6">
                {!isLogin && (
                  <div className="grid grid-cols-2 gap-4">
                    <Field name="firstName">
                      {({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={t("first_name")}
                          error={touched.firstName && !!errors.firstName}
                          helperText={touched.firstName && errors.firstName}
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
                    </Field>

                    <Field name="lastName">
                      {({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={t("last_name")}
                          error={touched.lastName && !!errors.lastName}
                          helperText={touched.lastName && errors.lastName}
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
                    </Field>

                    <Field name="phone">
                      {({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label={t("phone")}
                          error={touched.phone && !!errors.phone}
                          helperText={touched.phone && errors.phone}
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
                    </Field>

                    <Field name="dateOfBirth">
                      {({ field }) => (
                        <DatePicker
                          label={t("date_of_birth")}
                          value={field.value ? dayjs(field.value) : null}
                          onChange={(newValue) => {
                            setFieldValue(
                              "dateOfBirth",
                              newValue ? newValue.format("YYYY-MM-DD") : ""
                            );
                          }}
                          maxDate={dayjs()} // Prevents future dates
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error:
                                touched.dateOfBirth && !!errors.dateOfBirth,
                              helperText:
                                touched.dateOfBirth && errors.dateOfBirth,
                              InputProps: {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <FaCalendar />
                                  </InputAdornment>
                                ),
                              },
                              sx: {
                                ...textFieldStyles,
                                "& .MuiPickersDay-root.Mui-selected": {
                                  backgroundColor: "#DA9F5B",
                                  "&:hover": {
                                    backgroundColor: "#c48f51",
                                  },
                                },
                                "& .MuiPickersDay-root:hover": {
                                  backgroundColor: "rgba(218, 159, 91, 0.1)",
                                },
                              },
                            },
                          }}
                        />
                      )}
                    </Field>
                  </div>
                )}

                <Field name="email">
                  {({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label={t("email_placeholder")}
                      error={touched.email && !!errors.email}
                      helperText={touched.email && errors.email}
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
                </Field>

                <Field name="password">
                  {({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type={showPassword ? "text" : "password"}
                      label={t("password_placeholder")}
                      error={touched.password && !!errors.password}
                      helperText={touched.password && errors.password}
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
                              {showPassword ? (
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
                </Field>

                {!isLogin && (
                  <Field name="confirmPassword">
                    {({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type={showConfirmPassword ? "text" : "password"}
                        label={t("confirm_password_placeholder")}
                        error={
                          touched.confirmPassword && !!errors.confirmPassword
                        }
                        helperText={
                          touched.confirmPassword && errors.confirmPassword
                        }
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
                  </Field>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isSubmitting}
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
              </Form>
            )}
          </Formik>

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
