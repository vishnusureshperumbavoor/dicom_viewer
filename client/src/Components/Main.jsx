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
        // const blob = new Blob([arr.buffer], { type: "image/png" });
        let image = new Image(arr,200,200)
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.putImageData(image,20,20)
        // const url = URL.createObjectURL(blob);
        // setImageSrc(url);

        // const img = new Image();
        // img.onload = () => {
        //   canvas.width = img.width;
        //   canvas.height = img.height;
        //   ctx.drawImage(img, 0, 0);
        // };
        // img.src = url;
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
