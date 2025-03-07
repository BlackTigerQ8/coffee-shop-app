import React from "react";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";

const CheckoutPage = ({ cart }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const containerVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const calculateTotal = () => {
    return (
      cart?.reduce((total, item) => total + item.price * item.quantity, 0) || 0
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Process payment and create order
      const orderDetails = {
        // Add order details here
      };
      navigate("/order-confirmation", { state: { orderDetails } });
    } catch (error) {
      console.error("Checkout failed:", error);
    }
  };

  const textFieldStyles = {
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#DA9F5B",
      },
      "&:hover fieldset": {
        borderColor: "#c48f51",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#DA9F5B",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#656565",
      "&.Mui-focused": {
        color: "#DA9F5B",
      },
    },
  };

  return (
    <div ref={ref} className="flex flex-col min-h-screen">
      <Header title={t("checkout_title")} subtitle={t("checkout_subtitle")} />
      <motion.div
        className="flex-grow container mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Paper elevation={0} className="p-6 rounded-lg">
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-secondary mb-4">
                    {t("order_details")}
                  </h2>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label={t("first_name")}
                        required
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label={t("last_name")}
                        required
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label={t("email")}
                        type="email"
                        required
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label={t("phone")}
                        required
                        sx={textFieldStyles}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label={t("address")}
                        multiline
                        rows={3}
                        required
                        sx={textFieldStyles}
                      />
                    </Grid>
                  </Grid>
                </motion.div>

                <Divider className="my-6" />

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <h2 className="text-2xl font-bold text-secondary mb-4">
                    {t("payment_method")}
                  </h2>
                  <FormControl component="fieldset">
                    <RadioGroup
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <FormControlLabel
                        value="cash"
                        control={
                          <Radio
                            sx={{
                              color: "#DA9F5B",
                              "&.Mui-checked": {
                                color: "#DA9F5B",
                              },
                            }}
                          />
                        }
                        label={t("cash")}
                      />
                      <FormControlLabel
                        value="card"
                        control={
                          <Radio
                            sx={{
                              color: "#DA9F5B",
                              "&.Mui-checked": {
                                color: "#DA9F5B",
                              },
                            }}
                          />
                        }
                        label={t("credit_card")}
                      />
                    </RadioGroup>
                  </FormControl>
                </motion.div>
              </form>
            </Paper>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Paper
              elevation={0}
              className="p-6 rounded-lg bg-secondary text-white"
            >
              <h2 className="text-2xl font-bold mb-4">{t("order_summary")}</h2>
              <div className="space-y-4">
                {cart?.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-primary">{item.quantity}x</span>
                      <span>{item.name}</span>
                    </div>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <Divider className="my-4 bg-gray-600" />
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>{t("total")}:</span>
                  <span className="text-primary">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  sx={{
                    backgroundColor: "#DA9F5B",
                    marginTop: "2rem",
                    "&:hover": {
                      backgroundColor: "#c48f51",
                    },
                  }}
                >
                  {t("place_order")}
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => navigate("/cart")}
                  sx={{
                    borderColor: "#DA9F5B",
                    color: "#DA9F5B",
                    marginTop: "1rem",
                    "&:hover": {
                      borderColor: "#c48f51",
                      backgroundColor: "rgba(218, 159, 91, 0.04)",
                    },
                  }}
                >
                  {t("back_to_cart")}
                </Button>
              </div>
            </Paper>
          </motion.div>
        </div>
      </motion.div>
      <div className="mt-auto">
        <Footer />
      </div>
      <BackToTop />
    </div>
  );
};

export default CheckoutPage;
