const dicomjs = require("../index");
const fs = require("fs");
const path = require("path");
const sampleDcmPath = "./samples/CR-MONO1-10-chest";
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
const port = 5000;

app.get("/getData", (req, res) => {
  fs.readFile(path.join(__dirname, sampleDcmPath), function (err, buffer) {
    dicomjs.parse(buffer, function (err, dcmData) {
      if (!err) {
        const patientName = dcmData.dataset["00100010"].value;
        const pixelData = dcmData.dataset["7FE00010"].value;
        console.log(pixelData);
        res.send({ patientName, pixelData });
      } else {
        console.log(err);
        res.send(err);
      }
    });
  });
});

app.use(express.static(path.join(__dirname, "public")));
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
