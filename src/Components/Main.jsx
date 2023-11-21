import React, { useEffect, useState, useRef } from "react";
import PrimaryShapeButton from "./PrimaryShapeButton";
import Points from "../Functions/Point";
import Lines from "../Functions/Line";
import Angles from "../Functions/Angle";
import Circles from "../Functions/Circle";
import Rectangles from "../Functions/Rectangle";
import { data } from "dcmjs";

const linesInstance = new Lines();
const pointsInstance = new Points();
const anglesInstance = new Angles();
const circlesInstance = new Circles();
const rectangleInstance = new Rectangles();

function Main() {
  const canvasRef = useRef(null);
  const [patientName, setPatientName] = useState("");
  const [linePoints, setLinePoints] = useState([]);
  const [circlePoints, setCirclePoints] = useState([]);
  const [rectanglePoints, setRectanglePoints] = useState([]);
  const [anglePoints, setAnglePoints] = useState([]);
  const [selectedShape, setSelectedShape] = useState("Line");
  const [rotationAngle, setRotationAngle] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    linePoints.forEach((point) => {
      linesInstance.drawLinePoints(ctx, point.x, point.y);
    });

    for (let i = 0; i < linePoints.length - 1; i = i + 2) {
      const startPoint = linePoints[i];
      const endPoint = linePoints[i + 1];
      linesInstance.drawLines(ctx, startPoint, endPoint);
    }

    anglePoints.forEach((point) =>
      pointsInstance.drawPoints(ctx, point.x, point.y)
    );
    if (anglePoints.length >= 3) {
      for (let i = 0; i < anglePoints.length - 1; i = i + 3) {
        const startPoint = anglePoints[i];
        const endPoint1 = anglePoints[i + 1];
        const endPoint2 = anglePoints[i + 2];
        anglesInstance.drawAngles(ctx, startPoint, endPoint1, endPoint2);
      }
    }

    circlePoints.forEach((point, index) => {
      if (index % 2 === 0) {
        pointsInstance.drawPoints(ctx, point.x, point.y);
      }
    });

    if (circlePoints.length % 2 === 0) {
      for (let i = 0; i < circlePoints.length - 1; i = i + 2) {
        const startPoint = circlePoints[i];
        const endPoint = circlePoints[i + 1];
        circlesInstance.drawCircle(ctx, startPoint, endPoint);
      }
    }

    rectanglePoints.forEach((point) => {
      pointsInstance.drawPoints(ctx, point.x, point.y);
    });

    if (rectanglePoints.length >= 2) {
      for (let i = 0; i < rectanglePoints.length - 1; i = i + 2) {
        const startPoint = rectanglePoints[i];
        const endPoint = rectanglePoints[i + 1];
        rectangleInstance.drawRectangle(ctx, startPoint, endPoint);
      }
    }
  }, [linePoints, anglePoints, circlePoints, rectanglePoints]);

  const handleFileChange = async (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const file = e.target.files[0];
    if (file) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const newDicomDict = data.DicomMessage.readFile(arrayBuffer);
        setPatientName(newDicomDict.dict["00100010"]?.Value[0]?.Alphabetic);
        const pixelData = newDicomDict.dict["7FE00010"]?.Value[0];
        if (pixelData) {
          const image = new Image();
          image.src = arrayBufferToBase64(pixelData);
          image.onload = () => {
            ctx.drawImage(image, 0, 0);
          };
        }
      } catch (err) {
        console.log("error parsing dicom");
        console.log(err);
      }
    }
  };

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
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
          anglePoints
        );
        if (clickedAngle) {
          if (window.confirm("Do you want to delete the angle?")) {
            setAnglePoints([]);
          }
        } else {
          if (anglePoints.length <= 2) {
            setAnglePoints([...anglePoints, { x, y }]);
          }
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

      case "Rectangle":
        const clickedRectangle = rectangleInstance.findClickedRectangle(
          { x, y },
          rectanglePoints
        );
        if (clickedRectangle) {
          const angle = calculateRotationAngle(clickedRectangle.startPoint, {
            x,
            y,
          });
          setRotationAngle(angle);
          rectangleInstance.rotateRectangle(
            ctx,
            clickedRectangle.startPoint,
            clickedRectangle.endPoint,
            rotationAngle
          );
        } else {
          setRectanglePoints([...rectanglePoints, { x, y }]);
        }
        break;
      default:
        break;
    }
  };

  const arrayBufferToBase64 = (buffer) => {
    const binary = new Uint8Array(buffer);
    return "data:image/png;base64," + btoa(String.fromCharCode(...binary));
  };

  const handleShapeSelection = (shape) => {
    setSelectedShape(shape);
  };

  const snapTo45DegreeInterval = (angle) => {
    const snappedAngle = Math.round(angle / 45) * 45;
    return snappedAngle;
  };

  const calculateRotationAngle = (start, currentMousePos) => {
    const deltaX = currentMousePos.x - start.x;
    const deltaY = currentMousePos.y - start.y;
    const angleInRadians = Math.atan2(deltaY, deltaX);
    const angleInDegrees = (angleInRadians * 180) / Math.PI;
    return angleInDegrees;
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <h1>Patient Name : {patientName}</h1>
      <PrimaryShapeButton
        handleShapeSelection={handleShapeSelection}
        selectedShape={selectedShape}
      />
      <canvas
        onClick={handleCanvasClick}
        ref={canvasRef}
        width={500}
        height={500}
      />
    </div>
  );
}

export default Main;
