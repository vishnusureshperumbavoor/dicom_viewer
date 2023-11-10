const dicomjs = require("../index");
const assert = require("assert");
const fs = require("fs");
const path = require("path");
// const sampleDcmPath = "./samples/0002.DCM";
const sampleDcmPath = "./samples/DISCIMG/IMAGES/CRIMAGEA";
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
const port = 5000;

app.get("/", (req, res) => {
  res.send("connected successfully");
});

app.get("/getData", (req, res) => {
  fs.readFile(path.join(__dirname, sampleDcmPath), (err, buffer) => {
    console.time("Process_Time");
    // dicomjs.parse(buffer, function (err, dcmData) {
    //   if (err) {
    //     console.log(err);
    //   }

    //   console.timeEnd("Process_Time");
    //   console.time("Process_Time2");

    //   console.log("Process complete");
    //   if (!err) {
    //     console.log("Meta Elements..");
    //     for (var key in dcmData.metaElements) {
    //       console.log(
    //         "Tag: " + key + ", value: " + dcmData.metaElements[key].value
    //       );
    //     }

    //     console.log("Standard elements..");
    //     for (var key in dcmData.dataset) {
    //       if (dcmData.dataset[key].isSequence) {
    //         console.log("it is sequence");
    //         // console.log("Tag: ", key, ", Sequence: Yes");
    //       } else if (dcmData.dataset[key].isPixelData) {
    //            const dcmData.dataset[key].isPixelData;
    //         console.log("it is pixel data");
    //         // console.log("Tag: ", key, ", PixelData: Yes");
    //       } else {
    //         console.log("it is something else");
    //         // console.log(
    //         //   "Tag: " + key + ", value: " + dcmData.dataset[key].value
    //         // );
    //       }
    //     }

    //     console.log("Parsing complete..");
    //   }

    //   console.timeEnd("Process_Time2");
    //   assert.ok(err == null, "Parsed Results");
    // });

    dicomjs.parse(buffer, (err, dcmData) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error parsing DICOM file");
        return;
      } 

      const pixelData = dcmData.dataset["7FE00010"].value;
      const patientName = dcmData.dataset["00100010"].value;
      console.log(pixelData);
      console.log(patientName);
      res.send({ patientName, pixelData });
    });
  });
});

// app.get("/getPixelData", (req, res) => {
//   fs.readFile(path.join(__dirname, sampleDcmPath), (err, buffer) => {
//     dicomjs.parse(buffer, (err, dcmData) => {
//       if (err) {
//         console.log(err);
//         res.status(500).send("Error parsing DICOM file");
//         return;
//       }

//       var pixelData = dcmData.pixelData;
//       res.send(pixelData);
//     });
//   });
// });

// fs.readFile(path.join(__dirname, sampleDcmPath), function (err, buffer) {
//     console.time('Process_Time');
//     dicomjs.parse(buffer, function (err, dcmData) {
//         if(err) {
//             console.log(err);
//         }

//         console.timeEnd('Process_Time');
//         console.time('Process_Time2');

//         console.log('Process complete');
//         if (!err) {
//             console.log('Meta Elements..');
//             for (var key in dcmData.metaElements) {
//                 console.log('   tag: ', key, ', value: ', dcmData.metaElements[key].value);
//             }

//             console.log('Standard elements..');
//             for (var key in dcmData.dataset) {
//                 if(dcmData.dataset[key].isSequence) {
//                     console.log('   tag: ', key, ', Sequence: Yes');
//                 } else if(dcmData.dataset[key].isPixelData) {
//                     console.log('   tag: ', key, ', PixelData: Yes');
//                 } else {
//                     console.log('   tag: ', key, ', value: ', dcmData.dataset[key].value);
//                 }
//             }

//             console.log('Parsing complete..');
//         }

//         console.timeEnd('Process_Time2');
//         assert.ok(err == null, 'Parsed Results');
//     });
// });

// dicomjs.parseFile(path.join(__dirname, sampleDcmPath), function (err, dcmData) {
//     var patientName = dcmData.dataset['00100010'].value;
//     console.log("patiendName = " + patientName);
//     assert.ok(err == null, 'Parsed Results');
// });

app.use(express.static(path.join(__dirname, "public")));
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
