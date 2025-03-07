import React from "react";
import Header from "../components/Header";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Paper, Button, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import BackToTop from "../components/BackToTop";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const OrderConfirmationPage = ({ orderDetails }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "-100px" });
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  return (
    <div ref={ref} className="flex flex-col min-h-screen">
      <Header
        title={t("order_confirmation_title")}
        subtitle={t("order_confirmation_subtitle")}
      />
      <motion.div
        className="flex-grow container mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <CheckCircleIcon
              sx={{
                fontSize: 64,
                color: "#DA9F5B",
                marginBottom: 2,
              }}
            />
            <h2 className="text-2xl font-bold text-secondary">
              {t("order_confirmed")}
            </h2>
            <p className="text-gray-600 mt-2">
              {t("order_number")}: #{orderDetails?.orderId || "000000"}
            </p>
          </motion.div>

          <Paper elevation={0} className="p-6 rounded-lg mb-6">
            <h3 className="text-xl font-bold text-secondary mb-4">
              {t("order_details")}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-gray-600">
              <div>
                <p className="font-semibold">{t("client_name")}:</p>
                <p>
                  {orderDetails?.firstName} {orderDetails?.lastName}
                </p>
                <p>{orderDetails?.address}</p>
              </div>
              <div>
                <p className="font-semibold">{t("contact_info")}:</p>
                <p>{orderDetails?.email}</p>
                <p>{orderDetails?.phone}</p>
              </div>
            </div>
          </Paper>

          <Paper elevation={0} className="p-6 rounded-lg mb-6">
            <h3 className="text-xl font-bold text-secondary mb-4">
              {t("order_summary")}
            </h3>
            <div className="space-y-4">
              {orderDetails?.items?.map((item) => (
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
              <Divider className="my-4" />
              <div className="flex justify-between items-center text-xl font-bold">
                <span>{t("total")}:</span>
                <span className="text-primary">
                  ${orderDetails?.total?.toFixed(2)}
                </span>
              </div>
            </div>
          </Paper>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="contained"
              onClick={() => navigate("/")}
              sx={{
                backgroundColor: "#DA9F5B",
                "&:hover": {
                  backgroundColor: "#c48f51",
                },
              }}
            >
              {t("continue_shopping")}
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                /* Handle order tracking */
              }}
              sx={{
                borderColor: "#DA9F5B",
                color: "#DA9F5B",
                "&:hover": {
                  borderColor: "#c48f51",
                  backgroundColor: "rgba(218, 159, 91, 0.04)",
                },
              }}
            >
              {t("track_order")}
            </Button>
          </div>
        </div>
      </motion.div>
      <div className="mt-auto">
        <Footer />
      </div>
      <BackToTop />
    </div>
  );
};

export default OrderConfirmationPage;
