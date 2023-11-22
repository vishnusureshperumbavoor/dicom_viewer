const circleColor = "yellow";
const lineColor = "blue";
const textColor = "orange";
const textStrokeColor = "black";
const statsColor = "red";

class Circle {
  drawCircle = (ctx, start, end) => {
    // calculate radius
    const radius = this.findRadius(start, end);
    // draw circle
    ctx.beginPath();
    ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = circleColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    // pixels within the circle
    const imageData = ctx.getImageData(
      start.x - radius,
      start.y - radius,
      radius * 2,
      radius * 2
    );
    const pixelsWithinCircle = new Uint8Array(imageData.data.buffer);
    const selectedPixelValues = [];
    for (let i = 0; i < pixelsWithinCircle.length; i += 4) {
      selectedPixelValues.push(pixelsWithinCircle[i]);
    }

    // area
    const area = Math.PI * Math.pow(radius, 2);

    // calculate statistics
    const uint8Array = new Uint8Array(selectedPixelValues);
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

    this.drawLines(ctx, start, end);
  };

  findRadius = (start, end) => {
    return Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    );
  };

  findClickedCircle = (mousePos, circlePoints) => {
    const tolerance = 10;
    for (let i = 0; i < circlePoints.length - 1; i += 2) {
      const startPoint = circlePoints[i];
      const endPoint = circlePoints[i + 1];

      const center = {
        x: (startPoint.x + endPoint.x) / 2,
        y: (startPoint.y + endPoint.y) / 2,
      };

      const radius = this.findRadius(center, endPoint);
      const distanceToCenter = Math.sqrt(
        Math.pow(mousePos.x - center.x, 2) + Math.pow(mousePos.y - center.y, 2)
      );
      if (distanceToCenter <= radius + tolerance) {
        return { start: startPoint, end: endPoint };
      }
    }
    return null;
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

export default Circle;
