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

  const angleRadians =
    Math.atan2(end2.y - end1.y, end2.x - end1.x) -
    Math.atan2(start.y - end1.y, start.x - end1.x);
  let angleDegrees = (angleRadians * 180) / Math.PI;
  angleDegrees = angleDegrees < 0 ? angleDegrees + 360 : angleDegrees;
  const midPoint = {
    x: end1.x + 12,
    y: end1.y - 12,
  };
  ctx.fillStyle = angleTextColor;
  ctx.font = font;
  ctx.fillText(`${angleDegrees.toFixed(2)}°`, midPoint.x, midPoint.y);
};
