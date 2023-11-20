const circleColor = "yellow";
const lineColor = "blue";
const textColor = "white";
const textStrokeColor = "black";
const statsColor = "red"

class Circle {
  drawCircle = (ctx, start, end, pixelValues) => {
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

    // display area
    const area = Math.PI * Math.pow(radius, 2);

    // calculate statistics
    const uint8Array = new Uint8Array(pixelValues);
    // calculating max
    const max = Math.max(...Array.from(uint8Array));
    // calculating mean
    const mean =
      Array.from(uint8Array).reduce((acc, val) => acc + val, 0) /
      uint8Array.length;
    // calculating standard deviation
    const squaredDifferences = Array.from(uint8Array).map((val) =>
      Math.pow(val - mean, 2)
    );
    const variance =
      squaredDifferences.reduce((acc, val) => acc + val, 0) / uint8Array.length;
    const stdDev = Math.sqrt(variance);

    // display statistics
    const statsText = [
      `Area: ${area.toFixed(2)} mm²`,
      `Mean: ${mean.toFixed(2)}`,
      `Max: ${max.toFixed(2)}`,
      `Std Dev: ${stdDev.toFixed(2)}`,
    ];
    const lineHeight = 16;
    const statsTextWidth = ctx.measureText(statsText).width;
    const statsTextX = start.x - statsTextWidth / 2 + 10;
    const statsTextY = start.y + radius + 20;
    ctx.fillStyle = statsColor;
    ctx.font = "14px Arial";
    statsText.forEach((line, index) => {
      ctx.fillText(line, statsTextX, statsTextY + index * lineHeight);
    });
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
    const distance = this.calculateDistance(start, end);
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

  calculateDistance = (point1, point2) => {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
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

export default Circle;
