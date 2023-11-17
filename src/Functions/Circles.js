const circleColor = "yellow"

class Circles {
  drawCircle = (ctx, start, end) => {
    // calculate radius
    const radius = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    );

    // draw circle
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(start.x, start.y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = circleColor;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
  };

  findClickedCircle = (mousePos, clickedPoints) => {
    for (const line of clickedPoints.slice(0, -1)) {
      const start = line;
      const end = clickedPoints[clickedPoints.indexOf(line) + 1];
      if (pointOnCircle(mousePos, { start, end }, 5)) {
        return { start, end };
      }
    }
  };
}

const pointOnCircle = (point, line, tolerance) => {
  const distance =
    Math.abs(
      (line.end.y - line.start.y) * point.x -
        (line.end.x - line.start.x) * point.y +
        line.end.x * line.start.y -
        line.end.y * line.start.x
    ) /
    Math.sqrt(
      Math.pow(line.end.y - line.start.y, 2) +
        Math.pow(line.end.x - line.start.x, 2)
    );

  return distance < tolerance;
};

export default Circles;
