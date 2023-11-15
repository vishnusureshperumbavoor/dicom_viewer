import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import PrimaryShapeButton from "./PrimaryShapeButton";
import { drawPoints } from "../Functions/Points";
import { drawLines, findClickedLine } from "../Functions/Lines";
import { drawAngles } from "../Functions/Angles";
const serverURL = "http://localhost:5000";

function Main() {
  const canvasRef = useRef(null);
  const [patientName, setPatientName] = useState("");
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [linePoints, setLinePoints] = useState([]);
  const [points, setPoints] = useState([]);
  const [anglePoints, setAnglePoints] = useState([]);
  const [selectedShape, setSelectedShape] = useState("Line");

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

        linePoints.forEach((point) => drawPoints(ctx, point.x, point.y));
        if (linePoints.length >= 2) {
          for (let i = 0; i < linePoints.length - 1; i = i + 2) {
            const startPoint = linePoints[i];
            const endPoint = linePoints[i + 1];
            drawLines(ctx, startPoint, endPoint);
          }
        }
      })
      .catch((err) => {
        console.log("error");
      });
  }, [linePoints]);

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    switch (selectedShape) {
      case "Line":
        const clickedLine = findClickedLine({ x, y }, linePoints);
        if (clickedLine) {
          if (window.confirm("Do you want to delete the line?")) {
            const updatedLinePoints = linePoints.filter(
              (point) =>
                point !== clickedLine.start && point !== clickedLine.end
            );
            setLinePoints(updatedLinePoints);
          }
        } else {
          setLinePoints([...linePoints, { x, y }]);
        }
        break;
      case "Angle":
        setAnglePoints([...anglePoints, { x, y }]);
        break;
      default:
        break;
    }
  };

  const handleShapeSelection = (shape) => {
    setSelectedShape(shape);
  };

  return (
    <div>
      <h1>Patient Name : {patientName}</h1>
      <PrimaryShapeButton
        handleShapeSelection={handleShapeSelection}
        selectedShape={selectedShape}
      />
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
