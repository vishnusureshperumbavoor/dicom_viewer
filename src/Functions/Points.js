class Points {
  drawPoints = (ctx, x, y) => {
    const dotColor = "red";
    ctx.fillStyle = dotColor;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
  };
}

export default Points;
