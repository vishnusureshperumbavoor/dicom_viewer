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
}

export default Rectangle;
