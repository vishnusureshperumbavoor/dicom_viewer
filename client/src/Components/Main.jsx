import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
const serverURL = "http://localhost:5000";

function Main() {
  const [patientName, setPatientName] = useState("");
  const [imageSrc, setImageSrc] = useState("");

  const canvasRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${serverURL}/getData`)
      .then((response) => {
        const { patientName, pixelData } = response.data;
        setPatientName(patientName);
        const arr = new Uint8ClampedArray(pixelData.data);
        console.log(arr);
      })
      .catch((err) => {
        console.log("error");
        console.log(err);
      });
  }, []);

  return (
    <div>
      <h1>{patientName}</h1>
      <h2>{imageSrc}</h2>
      <canvas ref={canvasRef} id="vspcanvas"></canvas>
    </div>
  );
}

export default Main;
