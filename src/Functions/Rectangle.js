const rectangleColor = "orange"

class Rectangles {
  drawRectangle = (ctx, start, end) => {
    const A = { x: start.x, y: end.y };
    const B = end;
    const C = { x: end.x, y: start.y };
    const D = start;

    ctx.beginPath()
    ctx.moveTo(D.x,D.y)
    ctx.lineTo(A.x,A.y)
    ctx.lineTo(B.x,B.y)
    ctx.lineTo(C.x,C.y)
    ctx.lineTo(D.x,D.y)

    ctx.strokeStyle = rectangleColor
    ctx.stroke()
    ctx.closePath()
  };
}

export default Rectangles;
