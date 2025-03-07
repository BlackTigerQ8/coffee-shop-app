import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
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
import { Visibility, VisibilityOff } from "@mui/icons-material";

const UserAuthPage = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });
  const [isLogin, setIsLogin] = useState(true);
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
  };

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
