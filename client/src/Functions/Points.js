import { drawLines } from "./Lines";

export const drawPoints = (ctx, points) => {
  const dotColor = "red";
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

  drawLines(ctx, points);
};
