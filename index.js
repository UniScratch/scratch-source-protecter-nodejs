const dw = require('digital-watermarking');
//EnCode Image add digital watermarking
let srcFileName = "test/test.png";
let watermarkText = "Copyright GitScratch:TimFang4162(uid), under the Apache License 2.0.";
let fontSize = 0.5;
let enCodeFileName = "test/test_encode.png";
async function run() {
    let startTime = new Date().getTime();
    await dw.transformImageWithText(srcFileName, watermarkText, fontSize, enCodeFileName);
    //DeCode Image get digital watermarking
    let deCodeFileName = "test/test_decode.png";
    await dw.getTextFormImage(enCodeFileName, deCodeFileName);
    console.log('runTime', new Date().getTime() - startTime);

}
run()