import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
export const serverURL = "http://localhost:5000";

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
        const uint8Array = new Uint8Array(pixelData);
        const blob = new Blob([uint8Array]);
        const dataURL = URL.createObjectURL(blob);
        alert(dataURL);
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

  const handleDownload= ()=>{
    const dlink = document.createElement('a')
    dlink.href = imageSrc;
    dlink.download = 'download.png'
    document.body.appendChild(dlink)
    dlink.click()
    document.body.removeChild(dlink)
  }

  return (
    <div>
      <h1>{patientName}</h1>
      <p>{imageSrc}</p>
      <img src={imageSrc} alt="" />
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: "1px solid #000" }}
      ></canvas>
      <button onClick={handleDownload}>download</button>
    </div>
  );
}

export default Main;
