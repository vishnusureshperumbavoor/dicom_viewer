import React, { useEffect } from "react";
const imageURL =
  "https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

function Second() {
  useEffect(() => {
    const myCanvas = document.getElementById("myCanvas");
    const myContext = myCanvas.getContext("2d");
    const img = new Image();
    img.src = imageURL;
    img.onload = () => {
      myContext.drawImage(img, 0, 0);
    };
  }, []);

  return (
    <div>
      canvas
      <canvas
        id="myCanvas"
        width="400"
        height="300"
        style={{ border: "1px solid #000000" }}
      ></canvas>
    </div>
  );
}

export default Second;
