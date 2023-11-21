const rectangleColor = "orange";

class Rectangle {
  drawRectangle = (ctx, start, end) => {
    const A = { x: start.x, y: end.y };
    const B = end;
    const C = { x: end.x, y: start.y };
    const D = start;

    ctx.beginPath();
    ctx.moveTo(D.x, D.y);
    ctx.lineTo(A.x, A.y);
    ctx.lineTo(B.x, B.y);
    ctx.lineTo(C.x, C.y);
    ctx.lineTo(D.x, D.y);

    ctx.strokeStyle = rectangleColor;
    ctx.stroke();
    ctx.closePath();

    // calculate area
    const width = Math.sqrt(Math.pow(B.x - A.x, 2) + Math.pow(B.y - A.y, 2));
    const height = Math.sqrt(Math.pow(C.x - B.x, 2) + Math.pow(C.y - B.y, 2));
    const area = width * height;
    const text = `Area: ${area.toFixed(2)} mm²`;
    const textWidth = ctx.measureText(text).width;
    const textX = (start.x + end.x) / 2 - textWidth / 2;
    const textY = start.y + 20;
    ctx.fillStyle = "green";
    ctx.font = "14px Arial";
    ctx.fillText(text, textX, textY);
  };

  rotateRectangle = (ctx, start, end, angle) => {
    const cosTheta = Math.cos(angle);
    const sinTheta = Math.sin(angle);
    const translatedStart = { x: start.x - end.x, y: start.y - end.y };
    const translatedEnd = { x: 0, y: 0 };

    // apply rotation
    const rotatedStart = {
      x: translatedStart.x * cosTheta - translatedStart.y * sinTheta,
      y: translatedStart.x * sinTheta + translatedStart.y * cosTheta,
    };
    const rotatedEnd = {
      x: translatedEnd.x * cosTheta - translatedEnd.y * sinTheta,
      y: translatedEnd.x * sinTheta + translatedEnd.y * cosTheta,
    };
    const finalStart = {
      x: rotatedStart.x + end.x,
      y: rotatedStart.y + end.y,
    };
    const finalEnd = {
      x: rotatedEnd.x + end.x,
      y: rotatedEnd.y + end.y,
    };
    this.drawRectangle(ctx, finalStart, finalEnd);
  };

  findClickedRectangle = (mousePos, rectanglePoints) => {
    for (let i = 0; i < rectanglePoints.length - 1; i += 2) {
      const startPoint = rectanglePoints[i];
      const endPoint = rectanglePoints[i + 1];
      const rect = {
        x: Math.min(startPoint.x, endPoint.x),
        y: Math.min(startPoint.y, endPoint.y),
        width: Math.abs(endPoint.x - startPoint.x),
        height: Math.abs(endPoint.y - startPoint.y),
      };
      if (
        mousePos.x >= rect.x &&
        mousePos.x <= rect.x + rect.width &&
        mousePos.y >= rect.y &&
        mousePos.y <= rect.y + rect.height
      ) {
        return { startPoint, endPoint };
      }
    }
    return null;
  };

  rotatePoint = (point, center, angle) => {
    const radians = (angle * Math.PI) / 180;
    const cosTheta = Math.cos(radians);
    const sinTheta = Math.sin(radians);
    const x =
      cosTheta * (point.x - center.x) -
      sinTheta * (point.y - center.y) +
      center.x;
    const y =
      sinTheta * (point.x - center.x) -
      cosTheta * (point.y - center.y) +
      center.y;
    return { x, y };
  };

  rotateRectangle = (start, end, angle) => {
    const center = {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2,
    };
    const rotatedStart = this.rotatePoint(start, center, angle);
    const rotatedEnd = this.rotatePoint(end, center, angle);
    return [rotatedStart,rotatedEnd]
  };
}

export default Rectangle;
