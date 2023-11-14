import React from "react";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";

function PrimaryShapeButton({ handleShapeSelection }) {
  const shapeButtons = ["Line", "Angle", "Circle", "Rectangle"];
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
            sx={{ mr: 2, ml: 2 }}
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
