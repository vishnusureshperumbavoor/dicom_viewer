export const drawPoints = (ctx, points) => {
  const firstDotColor = "red";
  const secondDotColor = "red";
  const lineColor = "blue";
  const textColor = "white";
  const textStrokeColor = "black";
  const normalColor = "green";

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

  // line between points
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

  // normal line
  const normalSlope = -1 / calculateSlope(points[0], points[1]);
  const normalStart = {
    x: midPoint.x - 50,
    y: midPoint.y - 50 * normalSlope,
  };
  const normalEnd = {
    x: midPoint.x + 50,
    y: midPoint.y + 50 * normalSlope,
  };

  ctx.beginPath();
  ctx.setLineDash([10, 5]);
  ctx.moveTo(normalStart.x, normalStart.y);
  ctx.lineTo(normalEnd.x, normalEnd.y);
  ctx.strokeStyle = normalColor;
  ctx.stroke();
  ctx.setLineDash([]);

  // display the distance on the line
  ctx.fillStyle = textColor;
  ctx.strokeStyle = textStrokeColor;
  ctx.lineWidth = 2;
  ctx.font = "14px Arial";

  const text = `${distance.toFixed(2)}mm`;
  const textWidth = ctx.measureText(text).width;
  const textX = midPoint.x - textWidth / 2;
  const textY = midPoint.y;

  ctx.fillText(text, textX, textY);
  // ctx.strokeText(text, textX, textY);
};

const calculateDistance = (point1, point2) => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const calculateSlope = (point1, point2) => {
  return (point2.y - point1.y) / (point2.x - point1.x);
};

export const findClickedLine = (mousePos,clickedPoints) => {
  for (const line of clickedPoints.slice(0, -1)) {
    const start = line;
    const end = clickedPoints[clickedPoints.indexOf(line) + 1];
    if (pointOnLine(mousePos, { start, end }, 5)) {
      return { start, end };
    }
  }
};

const pointOnLine = (point,line,tolerance) =>{
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
}