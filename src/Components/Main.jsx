import React, { useEffect, useState, useRef } from "react";
import PrimaryShapeButton from "./PrimaryShapeButton";
import { drawPoints } from "../Functions/Points";
import {
  drawLines,
  drawTemporaryLine,
  findClickedLine,
} from "../Functions/Lines";
import { drawAngles, findClickedAngle } from "../Functions/Angles";
import { data } from "dcmjs";
import { Box } from "@mui/material";
import cornerstone from "cornerstone-core";
import { CornerstoneViewport } from "react-cornerstone-viewport";
import cornerstoneDICOMImageLoader from "@cornerstonejs/dicom-image-loader";
import dicomParser from "dicom-parser";

function Main() {
  const canvasRef = useRef(null);
  const [patientName, setPatientName] = useState("");
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [linePoints, setLinePoints] = useState([]);
  const [anglePoints, setAnglePoints] = useState([]);
  const [angleCoordinates, setAngleCoordinates] = useState([]);
  const [selectedShape, setSelectedShape] = useState("Line");

  const [dicomDict, setDicomDict] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    console.log(file);
    if (file) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const newDicomDict = data.DicomMessage.readFile(arrayBuffer);
        setPatientName(newDicomDict.dict["00100010"]?.Value[0]?.Alphabetic);
        const pixelData = newDicomDict.dict["7FE00010"]?.Value[0];
        if (pixelData) {
          cornerstone.enable(canvasRef.current);
          cornerstoneDICOMImageLoader.external.cornerstone = cornerstone;
          cornerstoneDICOMImageLoader.external.dicomParser = dicomParser
          var config = {
            maxWebWorkers: navigator.hardwareConcurrency || 1,
            startWebWorkersOnDemand: true,
          };
          cornerstoneDICOMImageLoader.webWorkerManager.initialize(config);
          // const imageId = cornerstoneDICOMImageLoader.wadouri.dataSetToDataURL(pixelData)
          const imageId = `dicomweb:${URL.createObjectURL(file)}`
          console.log("imageid = ",imageId);

          // cornerstone.loadImage(imageId).then((image) => {
          //   cornerstone.displayImage(canvasRef.current, image);
          // });
          // const image = new Image();
          // image.src = arrayBufferToBase64(pixelData);
          // image.onload = () => {
          //   const canvas = canvasRef.current;
          //   const context = canvas.getContext("2d");
          //   context.drawImage(image, 0, 0);
          // };
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

  useEffect(() => {
    return () => {
      cornerstone.disable(canvasRef.current);
    };
    // axios.get(`${serverURL}/getData`).then((response) => {
    //   const { patientName, pixelData, height, width } = response.data;
    //   setHeight(height);
    //   setWidth(width);
    //   setPatientName(patientName);
    //   const pixelArray = pixelData.data;
    //   const canvas = canvasRef.current;
    //   const ctx = canvas.getContext("2d");
    //   const arr = new Uint8ClampedArray(pixelArray);
    //   var imgData = ctx.createImageData(width, height);
    //   var j = 0;
    //   for (var i = 0; i < arr.length; i += 2) {
    //     imgData.data[j++] = pixelArray[i];
    //     imgData.data[j++] = pixelArray[i + 1];
    //     imgData.data[j++] = pixelArray[i + 2];
    //     imgData.data[j++] = 255;
    //   }
    //   ctx.putImageData(imgData, 0, 0);
    //   linePoints.forEach((point) => drawPoints(ctx, point.x, point.y));
    //   if (linePoints.length >= 2) {
    //     for (let i = 0; i < linePoints.length - 1; i = i + 2) {
    //       const startPoint = linePoints[i];
    //       const endPoint = linePoints[i + 1];
    //       drawLines(ctx, startPoint, endPoint);
    //     }
    //   }
    //   console.log(angleCoordinates);
    //   anglePoints.forEach((point) => drawPoints(ctx, point.x, point.y));
    //   if (angleCoordinates.length >= 1) {
    //     for (let i = 0; i < angleCoordinates.length; i = i + 1) {
    //       const currentAngle = angleCoordinates[i];
    //       const points = currentAngle.points;
    //       if (points.length >= 3) {
    //         const startPoint = points[0];
    //         const endPoint1 = points[1];
    //         const endPoint2 = points[2];
    //         drawAngles(ctx, startPoint, endPoint1, endPoint2);
    //       }
    //     }
    //   }
    // });
    // }, [linePoints, anglePoints]);
  }, []);

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    switch (selectedShape) {
      case "Line":
        const clickedLine = findClickedLine({ x, y }, linePoints);
        if (clickedLine) {
          if (window.confirm("Do you want to delete the line?")) {
            const updatedLinePoints = linePoints.filter(
              (angle) =>
                angle !== clickedLine.start && angle !== clickedLine.end
            );
            setLinePoints(updatedLinePoints);
          }
        } else {
          setLinePoints([...linePoints, { x, y }]);
        }
        break;
      case "Angle":
        const clickedAngle = findClickedAngle({ x, y }, angleCoordinates);
        console.log(clickedAngle);
        if (clickedAngle) {
          console.log("clicked on angle");
          // if (window.confirm("Do you want to delete the angle?")) {
          //   const updatedAngles = angleCoordinates.filter((angle) => {
          //     return angle.id !== clickedAngle.id;
          //   });
          //   setAngleCoordinates(updatedAngles);
          // }
        } else {
          setAnglePoints((points) => [...points, { x, y }]);
          // handleAngleClick(
          //   { x, y },
          //   angleCoordinates,
          //   setAngleCoordinates,
          //   anglePoints
          // );
        }
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
      <Box sx={{ mt: 4 }}>
        <input type="file" onChange={handleFileChange} />
        <h1>Patient Name : {patientName}</h1>
        <canvas ref={canvasRef} width={500} height={500}></canvas>
        {/* <PrimaryShapeButton
          handleShapeSelection={handleShapeSelection}
          selectedShape={selectedShape}
        />
        <canvas
          ref={canvasRef}
          onClick={handleCanvasClick}
          width={width}
          height={height}
          style={{ border: "1px solid #000000" }}
        /> */}
      </Box>
    </div>
  );
}

export default Main;
