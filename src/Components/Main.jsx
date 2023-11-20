import React, { useEffect, useState, useRef } from "react";
import PrimaryShapeButton from "./PrimaryShapeButton";
import Points from "../Functions/Points";
import Lines from "../Functions/Lines";
import Angles from "../Functions/Angles";
import Circles from "../Functions/Circles";
import { data } from "dcmjs";

function Main() {
  const canvasRef = useRef(null);
  const [patientName, setPatientName] = useState("");

  const [linePoints, setLinePoints] = useState([]);
  const [circlePoints, setCirclePoints] = useState([]);
  const [anglePoints, setAnglePoints] = useState([]);
  const [angleCoordinates, setAngleCoordinates] = useState([]);
  const [pixelValues, setPixelValues] = useState([]);

  const [selectedShape, setSelectedShape] = useState("Line");

  const linesInstance = new Lines();
  const pointsInstance = new Points();
  const anglesInstance = new Angles();
  const circlesInstance = new Circles();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    linePoints.forEach((point) =>
      pointsInstance.drawPoints(ctx, point.x, point.y)
    );

    if (linePoints.length >= 2) {
      for (let i = 0; i < linePoints.length - 1; i = i + 2) {
        const startPoint = linePoints[i];
        const endPoint = linePoints[i + 1];
        linesInstance.drawLines(ctx, startPoint, endPoint);
      }
    }

    console.log(linePoints);

    anglePoints.forEach((point) =>
      pointsInstance.drawPoints(ctx, point.x, point.y)
    );
    if (angleCoordinates.length >= 1) {
      for (let i = 0; i < angleCoordinates.length; i = i + 1) {
        const currentAngle = angleCoordinates[i];
        const points = currentAngle.points;
        if (points.length >= 3) {
          const startPoint = points[0];
          const endPoint1 = points[1];
          const endPoint2 = points[2];
          anglesInstance.drawAngles(ctx, startPoint, endPoint1, endPoint2);
        }
      }
    }

    circlePoints.forEach((point, index) => {
      if (index % 2 === 0) {
        pointsInstance.drawPoints(ctx, point.x, point.y);
      }
    });
    if (circlePoints.length >= 2) {
      for (let i = 0; i < circlePoints.length - 1; i = i + 2) {
        const startPoint = circlePoints[i];
        const endPoint = circlePoints[i + 1];
        circlesInstance.drawCircle(ctx, startPoint, endPoint, pixelValues);
        circlesInstance.drawLines(ctx, startPoint, endPoint);
        const radius = circlesInstance.calculateDistance(startPoint, endPoint);
        const area = circlesInstance.calculateArea(radius);
      }
    }
  }, [linePoints, anglePoints, circlePoints, angleCoordinates]);

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    switch (selectedShape) {
      case "Line":
        const clickedLine = linesInstance.findClickedLine({ x, y }, linePoints);
        if (clickedLine) {
          if (window.confirm("Do you want to delete the line?")) {
            const updatedLinePoints = linePoints.filter(
              (points) =>
                points !== clickedLine.start && points !== clickedLine.end
            );
            setLinePoints(updatedLinePoints);
          }
        } else {
          setLinePoints([...linePoints, { x, y }]);
        }
        break;

      case "Angle":
        const clickedAngle = anglesInstance.findClickedAngle(
          { x, y },
          angleCoordinates
        );

        if (clickedAngle) {
          // if (window.confirm("Do you want to delete the angle?")) {
          //   const updatedAngles = angleCoordinates.filter((angle) => {
          //     return angle.id !== clickedAngle.id;
          //   });
          //   setAngleCoordinates(updatedAngles);
          // }
        } else {
          setAnglePoints((points) => [...points, { x, y }]);
          anglesInstance.handleAngleClick(
            { x, y },
            angleCoordinates,
            setAngleCoordinates,
            anglePoints
          );
        }
        break;

      case "Circle":
        const clickedCircle = circlesInstance.findClickedCircle(
          { x, y },
          circlePoints
        );
        if (clickedCircle) {
          if (window.confirm("Do you want to delete the circle?")) {
            const updatedCirclePoints = circlePoints.filter(
              (points) =>
                points !== clickedCircle.start && points !== clickedCircle.end
            );
            setCirclePoints(updatedCirclePoints);
          }
        } else {
          setCirclePoints([...circlePoints, { x, y }]);
        }
        break;

      default:
        break;
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const newDicomDict = data.DicomMessage.readFile(arrayBuffer);
        setPatientName(newDicomDict.dict["00100010"]?.Value[0]?.Alphabetic);
        const pixelData = newDicomDict.dict["7FE00010"]?.Value[0];
        setPixelValues(pixelData);
        if (pixelData) {
          const image = new Image();
          image.src = arrayBufferToBase64(pixelData);
          image.onload = () => {
            const canvas = canvasRef.current;
            const context = canvas.getContext("2d");
            context.drawImage(image, 0, 0);
          };
        }
      } catch (err) {
        console.log("error parsing dicom");
        console.log(err);
      }
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    const binary = new Uint8Array(buffer);
    return "data:image/png;base64," + btoa(String.fromCharCode(...binary));
  };

  const handleShapeSelection = (shape) => {
    setSelectedShape(shape);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <h1>Patient Name : {patientName}</h1>
      <canvas
        onClick={handleCanvasClick}
        ref={canvasRef}
        width={500}
        height={500}
      ></canvas>
      <PrimaryShapeButton
        handleShapeSelection={handleShapeSelection}
        selectedShape={selectedShape}
      />
    </div>
  );
}

export default Main;
