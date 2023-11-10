import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import cornerstone from "cornerstone-core";
import cornerstoneTools from "cornerstone-tools";
const serverURL = "http://localhost:5000";

cornerstoneTools.external.cornerstone = cornerstone;
cornerstoneTools.init();

function Main() {
  const [patientName, setPatientName] = useState("");
  const [imageSrc, setImageSrc] = useState("");

  const canvasRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${serverURL}/getData`)
      .then((response) => {
        const { patientName, pixelData } = response.data;
        const blob = new Blob([pixelData]);
        const dataURL = URL.createObjectURL(blob);
        
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
