import React from "react";
import { Modal as MuiModal, Box, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const Modal = ({ open, onClose, onConfirm, title, message }) => {
  const { t } = useTranslation();

  return (
    <MuiModal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          width: {
            xs: "90%",
            sm: 400,
          },
          maxWidth: "90vw",
          bgcolor: "#33211D",
          borderRadius: 2,
          boxShadow: 24,
          p: { xs: 2, sm: 4 },
          border: `1px solid #DA9F5B`,
          position: "relative",
          outline: "none", // Remove the focus outline
        }}
        component={motion.div}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          sx={{
            color: "#FFF8F0",
            mb: 2,
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
          }}
        >
          {title}
        </Typography>
        <Typography
          id="modal-description"
          sx={{
            color: "#FFF8F0",
            mb: 2,
            fontSize: { xs: "0.9rem", sm: "1rem" },
          }}
        >
          {message}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: 2,
          }}
        >
          <Button
            onClick={onClose}
            sx={{
              color: "#FFF8F0",
              padding: { xs: "6px 12px", sm: "8px 16px" },
              "&:hover": {
                backgroundColor: "rgba(255, 248, 240, 0.1)",
              },
            }}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={onConfirm}
            sx={{
              backgroundColor: "#DA9F5B",
              color: "#FFF8F0",
              padding: { xs: "6px 12px", sm: "8px 16px" },
              "&:hover": {
                backgroundColor: "#c48f51",
              },
            }}
          >
            {t("confirm")}
          </Button>
        </Box>
      </Box>
    </MuiModal>
  );
};

export default Modal;
