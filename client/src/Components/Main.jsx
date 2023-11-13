import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const serverURL = "http://localhost:5000";

function Main() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();
  const [patientName, setPatientName] = useState("");

  useEffect(() => {
    axios
      .get(`${serverURL}/getData`)
      .then((response) => {
        const { patientName, pixelData, height, width } = response.data;
        const pixelArray = pixelData.data;
        setPatientName(patientName);
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const arr = new Uint8ClampedArray(pixelArray);
        var imgData = ctx.createImageData(width, height);
        for (var i = 0; i < arr.length; i += 4) {
          var x = (i / 4) % width;
          imgData.data[i] = pixelArray[x];
          imgData.data[i + 1] = pixelArray[x + 1];
          imgData.data[i + 2] = pixelArray[x + 2];
          imgData.data[i + 3] = 255;
        }
        ctx.putImageData(imgData,0,0)
      })
      .catch((err) => {
        console.log("error");
        console.log(err);
      });
  }, []);

  return (
    <div>
      <h3 onClick={() => navigate("/second")}>Second page</h3>
      <h1>{patientName}</h1>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        style={{ border: "1px solid #000000" }}
      />
    </div>
  );
}

export default Main;
