const lineColor = "blue";
const angleTextColor = "white";
const font = "bold 15px Arial";

export const drawAngles = (ctx, start, end1, end2) => {
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

export const findClickedAngle = (mousePos, points) => {
  for (const line of points.slice(0, -1)) {
    const start = line;
    const end = points[points.indexOf(line) + 1];
    if (pointOnLine(mousePos, { start, end }, 5)) {
      return { start, end };
    }
  }
};

const pointOnLine = (point, line, tolerance) => {
  const distance =
    Math.abs(
      (line.end.y - line.start.y) * point.x -
        (line.end.x - line.start.x) * point.y +
        line.end.x * line.start.y -
        line.end.y * line.start.x
    ) /
    Math.sqrt(
      Math.pow(line.end.y - line.start.y, 2) +
        Math.pow(line.end.x - line.start.x, 2)
    );

  return distance < tolerance;
};

export const handleAngleClick = (
  { x, y },
  angleCoordinates,
  setAngleCoordinates,
  anglePoints
) => {
  if (anglePoints.length % 3 === 0) {
    const newAngleObject = { id: new Date().getTime(), points: [{x,y}] };
    setAngleCoordinates([...angleCoordinates, newAngleObject]);
  } else {
    const updatedAnglePoints = [...angleCoordinates];
    const lastObject = updatedAnglePoints[updatedAnglePoints.length - 1];
    lastObject.points.push({ x, y });
    setAngleCoordinates(updatedAnglePoints);
  }
};

const calculateAngle = (pointA, pointB, pointC) => {
  const angleRadians =
    Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) -
    Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
  let angleDegrees = (angleRadians * 180) / Math.PI;
  return angleDegrees < 0 ? angleDegrees + 360 : angleDegrees;
};
