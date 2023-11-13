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
        console.log(pixelData);
        const uint8Array = new Uint8Array(pixelData.data);
        console.log(uint8Array);
        const blob = new Blob([uint8Array], { type: "image/png" });
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
          canvas.width = image.width;
          canvas.height = image.height;
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
