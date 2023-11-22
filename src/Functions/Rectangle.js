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

  rotatePoint = (point, angle) => {
    const cosTheta = Math.cos(angle);
    const sinTheta = Math.sin(angle);
    const xPrime = cosTheta * point.x - sinTheta * point.y;
    const yPrime = sinTheta * point.x + cosTheta * point.y;
    return { x: xPrime, y: yPrime };
  };

  drawRotatedAngle = (ctx, startPoint, endPoint, angle) => {
    const centerX = (startPoint.x + endPoint.x) / 2;
    const centerY = (startPoint.y + endPoint.y) / 2;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate((angle * Math.PI) / 180);
    const width = Math.abs(endPoint.x - startPoint.x);
    const height = Math.abs(endPoint.y - startPoint.y);
    ctx.fillRect(-width / 2, -height / 2, width, height);
    ctx.restore();
  };

  findClickedCorner = (mousePos, rectanglePoints) => {
    const tolerance = 5;
    for (let i = 0; i < rectanglePoints.length - 1; i += 2) {
      const startPoint = rectanglePoints[i];
      const endPoint = rectanglePoints[i + 1];
      const corners = [
        { x: startPoint.x, y: startPoint.y },
        { x: endPoint.x, y: startPoint.y },
        { x: endPoint.x, y: endPoint.y },
        { x: startPoint.x, y: endPoint.y },
      ];
      const clickedCorner = corners.find((corner) => {
        const distance = Math.sqrt(
          Math.pow(mousePos.x - corner.x, 2) +
            Math.pow(mousePos.y - corner.y, 2)
        );
        return distance <= tolerance;
      });
      if (clickedCorner) {
        return { corner: clickedCorner, rectangle: { startPoint, endPoint } };
      }
    }
    return null;
  };

  rotateRectangle = ({ startPoint, endPoint }, angle, pivot) => {
    const cosTheta = Math.cos(angle);
    const sinTheta = Math.sin(angle);

    const rotatedStartPoint = {
      x:
        cosTheta * (startPoint.x - pivot.x) -
        sinTheta * (startPoint.y - pivot.y) +
        pivot.x,
      y:
        sinTheta * (startPoint.x - pivot.x) +
        cosTheta * (startPoint.y - pivot.y) +
        pivot.y,
    };

    const rotatedEndPoint = {
      x:
        cosTheta * (endPoint.x - pivot.x) -
        sinTheta * (endPoint.y - pivot.y) +
        pivot.x,
      y:
        sinTheta * (endPoint.x - pivot.x) +
        cosTheta * (endPoint.y - pivot.y) +
        pivot.y,
    };

    return { startPoint: rotatedStartPoint, endPoint: rotatedEndPoint };
  };
}

export default Rectangle;
