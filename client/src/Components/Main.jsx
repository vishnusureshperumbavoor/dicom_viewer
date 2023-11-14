import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
const serverURL = "http://localhost:5000";

function Main() {
  const canvasRef = useRef(null);
  const [patientName, setPatientName] = useState("");
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [clickedPoints, setClickedPoints] = useState([]);

  useEffect(() => {
    axios
      .get(`${serverURL}/getData`)
      .then((response) => {
        const { patientName, pixelData, height, width } = response.data;
        setHeight(height);
        setWidth(width);
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
        drawPoints(ctx, clickedPoints);
      })
      .catch((err) => {
        console.log("error");
      });
  }, [clickedPoints]);

  const drawPoints = (ctx, points) => {
    const firstDotColor = "red";
    const secondDotColor = "red";
    const lineColor = "blue";

    // designing first dot
    ctx.fillStyle = firstDotColor;
    ctx.beginPath();
    ctx.arc(points[0].x, points[0].y, 5, 0, 2 * Math.PI);
    ctx.fill();

    // designing 2nd dot
    ctx.fillStyle = secondDotColor;
    ctx.beginPath();
    ctx.arc(points[1].x, points[1].y, 5, 0, 2 * Math.PI);
    ctx.fill();

    // draw line between points
    const distance = calculateDistance(points[0], points[1]);
    const midPoint = {
      x: (points[0].x + points[1].x) / 2,
      y: (points[0].y + points[1].y) / 2,
    };
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    ctx.lineTo(points[1].x, points[1].y);
    ctx.strokeStyle = lineColor;
    ctx.stroke();

    // display the distance on the line
    ctx.fillStyle = lineColor;
    ctx.font = "14px Arial";
    ctx.fillText(`${distance.toFixed(2)}mm`, midPoint.x, midPoint.y);
  };

  const calculateDistance = (point1, point2) => {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (clickedPoints.length < 2) {
      setClickedPoints([...clickedPoints, { x, y }]);
    }
  };
  return (
    <div>
      <h1>Patient Name : {patientName}</h1>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        width={width}
        height={height}
        style={{ border: "1px solid #000000" }}
      />
    </div>
  );
}

export default Main;
