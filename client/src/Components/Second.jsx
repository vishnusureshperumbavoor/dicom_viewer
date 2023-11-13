import React, { useEffect } from "react";
const imageURL =
  "https://images.pexels.com/photos/268533/pexels-photo-268533.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";

function Second() {
  useEffect(() => {
    const myCanvas = document.getElementById("myCanvas");
    const myContext = myCanvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageURL;
    img.onload = () => {
      myContext.drawImage(img, 0, 0);
      const imageData = myContext.getImageData(
        0,
        0,
        myCanvas.width,
        myCanvas.height
      );
      const arr = imageData.data;
      for (var i = 0; i < arr.length; i += 4) {
        var brightness = 0.34 * arr[i] + 0.5 * arr[i + 1] + 0.16 * arr[i + 2];
        arr[i] = brightness;
        arr[i + 1] = brightness;
        arr[i + 2] = brightness;
      }

      console.log(arr);

      const myCanvas2 = document.getElementById("myCanvas2");
      const myContext2 = myCanvas2.getContext("2d");
      const newImageData = new ImageData(
        new Uint8ClampedArray(arr),
        myCanvas.width,
        myCanvas.height
      );
      myContext2.putImageData(newImageData, 0, 0);
    };
  }, []);

  return (
    <div>
      <h1>Grayscale</h1>
      <canvas
        id="myCanvas"
        width="400"
        height="300"
        style={{ border: "1px solid #000000" }}
      ></canvas>
      &nbsp;
      <canvas
        id="myCanvas2"
        width="400"
        height="300"
        style={{ border: "1px solid #000000" }}
      ></canvas>
    </div>
  );
}

export default Second;
