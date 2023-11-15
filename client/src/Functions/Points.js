export const drawPoints = (ctx, x, y) => {
  const dotColor = "red";
  // designing first dot
  ctx.fillStyle = dotColor;
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, 2 * Math.PI);
  ctx.fill();
};
