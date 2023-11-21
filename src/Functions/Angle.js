const lineColor = "blue";
const angleTextColor = "orange";
const font = "bold 15px Arial";

class Angle {
  drawAngles = (ctx, start, end1, end2) => {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end1.x, end1.y);
    ctx.lineTo(end2.x, end2.y);
    ctx.strokeStyle = lineColor;
    ctx.stroke();
    ctx.closePath();

    // angle calculation
    const angleDegrees = calculateAngle(start, end1, end2);
    const midPoint = {
      x: end1.x + 10,
      y: end1.y - 10,
    };

    // show angle
    ctx.fillStyle = angleTextColor;
    ctx.font = font;
    ctx.fillText(`${angleDegrees.toFixed(2)}°`, midPoint.x, midPoint.y);
  };

  findClickedAngle = (mousePos, clickedPoints) => {
    const tolerance = 5;
    for (const line of clickedPoints.slice(0, -1)) {
      const start = line;
      const end = clickedPoints[clickedPoints.indexOf(line) + 1];
      if (pointOnLine(mousePos, start, end, tolerance)) {
        return { start, end };
      }
    }
  };
}

const pointOnLine = (point, start, end, tolerance) => {
  const distance =
    Math.abs(
      (end.y - start.y) * point.x -
        (end.x - start.x) * point.y +
        end.x * start.y -
        end.y * start.x
    ) / Math.sqrt(Math.pow(end.y - start.y, 2) + Math.pow(end.x - start.x, 2));
  return distance < tolerance;
};

const calculateAngle = (pointA, pointB, pointC) => {
  const angleRadians =
    Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) -
    Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
  let angleDegrees = (angleRadians * 180) / Math.PI;
  return angleDegrees < 0 ? angleDegrees + 360 : angleDegrees;
};

export default Angle;
