var dicomjs = require('../index'),
    assert = require('assert'),
    fs = require('fs'),
    path = require('path'),
    sampleDcmPath = '../../dicom_react/src/dicomData/1.dcm'
    ;

fs.readFile(path.join(__dirname, sampleDcmPath), function (err, buffer) {
    console.time('Process_Time');
    dicomjs.parse(buffer, function (err, dcmData) {
        if(err) {
            console.log(err);
        }

        console.timeEnd('Process_Time');
        console.time('Process_Time2');

        console.log('Process complete');
        if (!err) {
            console.log('Meta Elements..');
            for (var key in dcmData.metaElements) {
                console.log('   tag: ', key, ', value: ', dcmData.metaElements[key].value);
            }

            console.log('Standard elements..');
            for (var key in dcmData.dataset) {
                if(dcmData.dataset[key].isSequence) {
                    console.log('   tag: ', key, ', Sequence: Yes');
                } else if(dcmData.dataset[key].isPixelData) {
                    console.log('   tag: ', key, ', PixelData: Yes');
                } else {
                    console.log('   tag: ', key, ', value: ', dcmData.dataset[key].value);
                }
            }

            console.log('Parsing complete..');
        }

        console.timeEnd('Process_Time2');
        assert.ok(err == null, 'Parsed Results');
    });
});

dicomjs.parseFile(path.join(__dirname, sampleDcmPath), function (err, dcmData) {
    console.log('Parsing file complete..');

    var patientName = dcmData.dataset['00100010'].value;
    console.log("patiendName = " + patientName);
    assert.ok(err == null, 'Parsed Results');
});