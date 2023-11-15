export const drawAngles = (ctx, points) => {
  const dotColor = "red";
  const lineColor = "blue";

  // designing first dot
  ctx.fillStyle = dotColor;
  ctx.beginPath();
  ctx.arc(points[0].x, points[0].y, 5, 0, 2 * Math.PI);
  ctx.fill();

  // designing 2nd dot
  ctx.fillStyle = dotColor;
  ctx.beginPath();
  ctx.arc(points[1].x, points[1].y, 5, 0, 2 * Math.PI);
  ctx.fill();

  // designing 3rd dot
  ctx.fillStyle = dotColor;
  ctx.beginPath();
  ctx.arc(points[2].x, points[2].y, 5, 0, 2 * Math.PI);
  ctx.fill();

  // line between points
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  ctx.lineTo(points[1].x, points[1].y);
  ctx.lineTo(points[2].x, points[2].y);
  ctx.strokeStyle = lineColor;
  ctx.stroke();
};
