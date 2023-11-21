import { Button } from "@mui/material";
import React from "react";

function PrimaryShapeButton({ handleShapeSelection, selectedShape }) {
  const shapeButtons = ["Line", "Angle", "Circle", "Rectangle"];
  return (
    <div>
        {shapeButtons.map((label) => (
          <Button
            key={label}
            variant="contained"
            sx={{
              mr: 2,
              ml: 2,
              mb:2,
              border: selectedShape === label ? "5px solid green" : "none",
            }}
            onClick={() => handleShapeSelection(label)}
          >
            {label}
          </Button>
        ))}
    </div>
  );
}

export default PrimaryShapeButton;
