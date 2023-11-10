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
        const { patientName, pixelDataElement } = response.data;
        const pixelData = new Uint8Array(pixelDataElement.data);
        console.log(pixelData);
        const blob = new Blob([pixelData], { type: "image/jpeg" });
        console.log(blob);
        const dataURL = URL.createObjectURL(blob);
        console.log(dataURL);

        setPatientName(patientName);
        setImageSrc(dataURL);

        const image = new Image();
        image.src = dataURL;
        image.onload = () => {
          const canvas = canvasRef.current;
          const context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
      })
      .catch((err) => {
        console.log("error");
      });
  }, []);

  return (
    <div>
      <h1>{patientName}</h1>
      <p>{imageSrc}</p>
      {/* <img src={imageSrc} alt="" /> */}
      <img id="image-container" src="" alt="" />
      <div id="dicomImage"></div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: "1px solid #000" }}
      ></canvas>
    </div>
  );
}

export default Main;
