import React from 'react'
import Button from "@mui/material/Button";

function PrimaryShapeButton({label}) {
  return (
    <div>
      <Button variant="contained" sx={{mr:2,ml:2}} >
        {label}
      </Button>
    </div>
  );
}

export default PrimaryShapeButton