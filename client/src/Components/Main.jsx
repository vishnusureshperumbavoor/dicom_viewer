import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
const serverURL = "http://localhost:5000";

function Main() {
  const canvasRef = useRef(null);
  const [patientName, setPatientName] = useState("");
  const [height,setHeight] = useState(0)
  const [width,setWidth] = useState(0)

  useEffect(() => {
    axios
      .get(`${serverURL}/getData`)
      .then((response) => {
        const { patientName, pixelData, height, width } = response.data;
        setHeight(height)
        setWidth(width)
        setPatientName(patientName);
        const pixelArray = pixelData.data;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const arr = new Uint8ClampedArray(pixelArray);
        var imgData = ctx.createImageData(width, height);
        var j = 0;
        for (var i = 0; i < arr.length; i += 2) {
          imgData.data[j++] = pixelArray[i];
          imgData.data[j++] = pixelArray[i + 1];
          imgData.data[j++] = pixelArray[i + 2];
          imgData.data[j++] = 255;
        }
        ctx.putImageData(imgData, 0, 0);
      })
      .catch((err) => {
        console.log("error");
      });
  }, []);

  return (
    <div>
      <h1>Patient Name : {patientName}</h1>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ border: "1px solid #000000" }}
      />
    </div>
  );
}

export default Main;
