export const handleAngleClick = (
  { x, y },
  setAngles,
  angles,
  setClickedPoints,
  clickedPoints
) => {
  if (clickedPoints.length < 3) {
    setClickedPoints([...clickedPoints, { x, y }]);
  } else {
    const [pointA, pointB, pointC] = clickedPoints;
    const angle = calculateAngle(pointA, pointB, { x, y });
    setAngles([...angles, { angle, points: [pointA, pointB, { x, y }] }]);
    setClickedPoints([]);
  }
};

const calculateAngle = (pointA, pointB, pointC) => {
  const angleRadians =
    Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x) -
    Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x);
  let angleDegrees = (angleRadians * 180) / Math.PI;
  angleDegrees = angleDegrees < 0 ? angleDegrees + 360 : angleDegrees;
  return angleDegrees;
};

export const drawAngles = (ctx, anglesToDraw) => {
  anglesToDraw.forEach(({ angle, points }) => {
    // Implement drawing logic for angles
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    const midPoint = {
      x: (points[1].x + points[2].x) / 2,
      y: (points[1].y + points[2].y) / 2,
    };
    ctx.fillText(`${angle.toFixed(2)}°`, midPoint.x, midPoint.y);
  });
};
