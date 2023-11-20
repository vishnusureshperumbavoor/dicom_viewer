const lineColor = "blue";
const textColor = "white";
const textStrokeColor = "black";
const normalColor = "green";

class Lines {
  drawLines = (ctx, start, end) => {
    // line between points
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = lineColor;
    ctx.stroke();

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

    // normal line
    const normalSlope = -1 / calculateSlope(start, end);
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
  };

  findClickedLine = (mousePos, clickedPoints) => {
    for (const line of clickedPoints.slice(0, -1)) {
      const start = line;
      const end = clickedPoints[clickedPoints.indexOf(line) + 1];
      if (pointOnLine(mousePos, { start, end }, 5)) {
        return { start, end };
      }
    }
  };

  drawTemporaryLine = (ctx, start, end) => {
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.strokeStyle = lineColor;
    ctx.stroke();
  };
}

const calculateDistance = (point1, point2) => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const calculateSlope = (point1, point2) => {
  return (point2.y - point1.y) / (point2.x - point1.x);
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

export default Lines;
