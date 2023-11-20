class Point {
  drawPoints = (ctx, x, y) => {
    const dotColor = "red";
    ctx.fillStyle = dotColor;
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fill();
  };
}

export default Point;
