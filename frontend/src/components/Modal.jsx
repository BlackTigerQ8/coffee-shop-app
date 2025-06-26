import React from "react";
import { Typography, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import StyledDialog, {
  StyledDialogContent,
  StyledDialogActions,
} from "./StyledDialog";

const Modal = ({ open, onClose, onConfirm, title, message }) => {
  const { t } = useTranslation();

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      title={title}
      maxWidth="sm"
      showCloseButton={true}
    >
      <StyledDialogContent>
        <Typography
          sx={{
            color: "#33211D",
            fontSize: { xs: "0.9rem", sm: "1rem" },
            mb: 2,
          }}
        >
          {message}
        </Typography>
      </StyledDialogContent>
      <StyledDialogActions>
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
      </StyledDialogActions>
    </StyledDialog>
  );
};

export default Modal;
