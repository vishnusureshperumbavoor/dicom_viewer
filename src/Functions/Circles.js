const circleColor = "yellow";
const lineColor = "blue";
const textColor = "white";
const textStrokeColor = "black";

class Circles {
  drawCircle = (ctx, start, end) => {
    // calculate radius
    const radius = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    );

    // draw circle
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = circleColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
  };

  findClickedCircle = (mousePos, clickedPoints) => {
    for (const line of clickedPoints.slice(0, -1)) {
      const start = line;
      const end = clickedPoints[clickedPoints.indexOf(line) + 1];
      if (pointOnCircle(mousePos, { start, end }, 5)) {
        return { start, end };
      }
    }
  };

  drawLines = (ctx, start, end) => {
    // line between points
    const originalLineDash = ctx.getLineDash();
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = lineColor;
    ctx.stroke();

    ctx.setLineDash(originalLineDash);

    // display the distance on the line
    const distance = calculateDistance(start, end);
    const midPoint = {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
    };
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

  calculateArea = (radius) => {
    return Math.PI * Math.pow(radius, 2);
  };
}

const pointOnCircle = (point, line, tolerance) => {
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

const calculateDistance = (point1, point2) => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const calculateSlope = (point1, point2) => {
  return (point2.y - point1.y) / (point2.x - point1.x);
};

export default Circles;
