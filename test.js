const dw = require('digital-watermarking');


//EnCode Image add digital watermarking
async function run(srcFileName, watermarkText, fontSize, enCodeFileName) {
    let startTime = new Date().getTime();
    await dw.transformImageWithText(srcFileName, watermarkText, fontSize, enCodeFileName);
    //DeCode Image get digital watermarking
    let deCodeFileName = "test/test_decode.png";
    await dw.getTextFormImage(enCodeFileName, deCodeFileName);
    console.log('runTime', new Date().getTime() - startTime);

}

const watermarkText = "Copyright GitScratch:TimFang4162(uid), under the Apache License 2.0."
const fontSize = 0.5


let deCodeFileName = "test/test_decode.png";
dw.getTextFormImage('test/QQ20220721163747.png', deCodeFileName);