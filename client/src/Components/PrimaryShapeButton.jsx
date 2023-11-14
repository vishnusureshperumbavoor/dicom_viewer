import React, { useState } from "react";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";

function PrimaryShapeButton({ handleShapeSelection, selectedShape }) {
  const shapeButtons = ["Line", "Angle", "Circle", "Rectangle"];
  const [selectedButton,setSelectedButton] = useState(null)
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          mb: 3,
        }}
      >
        {shapeButtons.map((label) => (
          <Button
            key={label}
            variant="contained"
            sx={{
              mr: 2,
              ml: 2,
              border: selectedShape === label ? "5px solid green" : "none",
            }}
            onClick={() => handleShapeSelection(label)}
          >
            {label}
          </Button>
        ))}
      </Box>
    </div>
  );
}

export default PrimaryShapeButton;
