const dicomjs = require("../index");
const assert = require("assert");
const fs = require("fs");
const path = require("path");
// const sampleDcmPath = "./samples/0002.DCM";
const sampleDcmPath = "./samples/CR-MONO1-10-chest";
const express = require("express");
const cors = require("cors");
const dicomParser = require("dicom-parser")

const app = express();
app.use(cors());
const port = 5000;

app.get("/getData", (req, res) => {
  fs.readFile(path.join(__dirname,sampleDcmPath), function (err, buffer) {
    dicomjs.parse(buffer, function (err, dcmData) {
      if (!err) {
        for (var key in dcmData.metaElements) {
          console.log(
            "   tag: ",
            key,
            ", value: ",
            dcmData.metaElements[key].value
          );
        }

        for (var key in dcmData.dataset) {
          if (dcmData.dataset[key].isSequence) {
            /// TODO: Parse sequence here
            console.log("   tag: ", key, ", Sequence: Yes");
          } else if (dcmData.dataset[key].isPixelData) {
            /// TODO: Handle PixelData here
            console.log("   tag: ", key, ", PixelData: Yes");
          } else {
            console.log(
              "   tag: ",
              key,
              ", value: ",
              dcmData.dataset[key].value
            );
          }
        }

        /// Reading patient name
        const patientName = dcmData.dataset["00100010"].value;
        const pixelDataElement = dcmData.dataset["7FE00010"].value;
        // const pixelData = new Uint8Array(pixelDataElement);
        res.send({ patientName, pixelDataElement });
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
