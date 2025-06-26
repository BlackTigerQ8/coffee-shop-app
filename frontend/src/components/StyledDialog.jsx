import React from "react";
import { Modal as MuiModal, Box, Typography, IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { motion } from "framer-motion";

const StyledDialog = ({
  open,
  onClose,
  title,
  children,
  maxWidth = "md",
  fullWidth = true,
  showCloseButton = true,
  sx = {},
}) => {
  const getMaxWidth = () => {
    switch (maxWidth) {
      case "xs":
        return { xs: "90%", sm: 300 };
      case "sm":
        return { xs: "90%", sm: 400 };
      case "md":
        return { xs: "90%", sm: 600, md: 700 };
      case "lg":
        return { xs: "90%", sm: 800, md: 900 };
      case "xl":
        return { xs: "90%", sm: 1000, md: 1200 };
      default:
        return { xs: "90%", sm: 600, md: 700 };
    }
  };

  const baseStyles = {
    width: fullWidth ? getMaxWidth() : "auto",
    maxWidth: "95vw",
    maxHeight: "90vh",
    bgcolor: "#FFF8F0",
    borderRadius: 2,
    boxShadow: 24,
    border: `1px solid #DA9F5B`,
    position: "relative",
    outline: "none",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <MuiModal
      open={open}
      onClose={onClose}
      aria-labelledby="styled-dialog-title"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 999,
        p: 1,
      }}
    >
      <Box
        sx={{ ...baseStyles, ...sx }}
        component={motion.div}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="overlay-top overlay-bottom"
      >
        {(title || showCloseButton) && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: { xs: 2, sm: 3 },
              borderBottom: `1px solid #DA9F5B`,
              flexShrink: 0,
            }}
          >
            {title && (
              <Typography
                id="styled-dialog-title"
                variant="h6"
                component="h2"
                sx={{
                  color: "#33211D",
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                  fontWeight: 600,
                }}
              >
                {title}
              </Typography>
            )}
            {showCloseButton && (
              <IconButton
                onClick={onClose}
                sx={{
                  color: "#33211D",
                  "&:hover": {
                    backgroundColor: "rgba(255, 248, 240, 0.1)",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        )}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#DA9F5B",
              borderRadius: "4px",
              "&:hover": {
                backgroundColor: "#c48f51",
              },
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </MuiModal>
  );
};

// StyledDialogContent component for consistent padding
export const StyledDialogContent = ({
  children,
  sx = {},
  noPadding = false,
}) => (
  <Box
    sx={{
      p: noPadding ? 0 : { xs: 2, sm: 3 },
      color: "#FFF8F0",
      ...sx,
    }}
  >
    {children}
  </Box>
);

// StyledDialogActions component for consistent button styling
export const StyledDialogActions = ({ children, sx = {} }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "flex-end",
      gap: 2,
      p: { xs: 2, sm: 3 },
      borderTop: `1px solid #DA9F5B`,
      flexShrink: 0,
      ...sx,
    }}
  >
    {children}
  </Box>
);

export default StyledDialog;
