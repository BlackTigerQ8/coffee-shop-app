import React from "react";
import { Paper } from "@mui/material";

const CustomCard = ({ children, className = "", ...props }) => {
  return (
    <Paper
      className={`overlay-top overlay-bottom ${className}`}
      elevation={0}
      sx={{
        position: "relative",
        backgroundColor: "#d6c4ae",
        margin: "1rem",
        width: "250px",
        height: "300px",
        ...props.sx,
      }}
      {...props}
    >
      {children}
    </Paper>
  );
};

export default CustomCard;
