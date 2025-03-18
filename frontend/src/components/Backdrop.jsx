import React from "react";
import { Backdrop as MuiBackdrop } from "@mui/material";
import { hourglass } from "ldrs";

hourglass.register();

const Backdrop = ({ isOpen }) => {
  return (
    <MuiBackdrop
      open={isOpen}
      sx={{
        color: "lightgray",
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      }}
    >
      <div
        className="p-8 rounded-lg flex items-center justify-center"
        style={{
          backgroundColor: "#da9f5b5e",
          border: `1px solid #da9f5b`,
        }}
      >
        <l-hourglass
          size="60"
          bg-opacity="0.2"
          speed="1.75"
          color="#33211D"
        ></l-hourglass>
      </div>
    </MuiBackdrop>
  );
};

export default Backdrop;
