import React, { useEffect, useRef } from "react";

const Third = () => {
  const canvasRef = useRef(null);
  

  useEffect(() => {
    

    // Your pixel array data (replace this with your actual pixel array)
    const pixelArray = [
      // Row 1
      255,
      0,
      0,
      255, // Red
      255,
      0,
      0,
      255, // Red
      255,
      0,
      0,
      255, // Red
      255,
      0,
      0,
      255, // Red

      // Row 2
      0,
      0,
      0,
      255, // Black
      0,
      0,
      0,
      255, // Black
      0,
      0,
      0,
      255, // Black
      0,
      0,
      0,
      255, // Black

      // Row 3
      0,
      255,
      0,
      255, // Green
      0,
      255,
      0,
      255, // Green
      0,
      255,
      0,
      255, // Green
      0,
      255,
      0,
      255, // Green

      // Row 4
      0,
      0,
      255,
      255, // Blue
      0,
      0,
      255,
      255, // Blue
      0,
      0,
      255,
      255, // Blue
      0,
      0,
      255,
      255, // Blue
    ];

    // Set canvas size
    const width = 4;
    const height = 4;

    if (pixelArray.length !== 4 * width * height) {
      console.error("Invalid pixel array length");
    } else {
      console.log("Pixel array length is valid");
    }

    // Get canvas context
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Create ImageData from pixel array
    const imageData = new Uint8ClampedArray(pixelArray);
    const image = new ImageData(imageData, width, height);

    // Put the ImageData onto the canvas
    ctx.putImageData(image, 0, 0);
  }, []);

  return <canvas ref={canvasRef} width={400} height={400} />;
};

export default Third;
