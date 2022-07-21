const dw = require('digital-watermarking');
const jszip = require('jszip')
const fs = require('fs')
const md5 = data =>  require('crypto').createHash('md5').update(data).digest('hex') 


const tempFolder = "temp";
const imageExts = ['png', 'jpg'];
const soundExts = ['mp3', 'wav'];
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


//create temp folder
fs.rmdirSync(tempFolder, {
    recursive: true,
    force: true
});
fs.mkdirSync(tempFolder);
fs.mkdirSync(tempFolder+"/watermask");

async function read(zipFileName) {
    let projectZip = await jszip.loadAsync(fs.readFileSync(zipFileName));
    const assets = {}
    for (fileName in projectZip.files) {
        // console.log(fileName);
        let ext = fileName.split('.').pop();
        // if (imageExts.includes(ext)) {
            let filePath = tempFolder + "/" + fileName;
            if (fs.existsSync(filePath)) {
                continue;
            }
            let fileBuffer = await projectZip.files[fileName].async('nodebuffer');
        fs.writeFileSync(filePath, fileBuffer);
        assets[fileName] = '';
        // }
    }
    //read project.json from temp
    let projectJson = JSON.parse(fs.readFileSync(tempFolder + "/project.json"));
    // let projectJson = JSON.parse(await projectZip.files['project.json'].async('string'));
    // console.log(projectJson);
    // for (eachSprite of projectJson.targets) {
    //     console.log(eachSprite.name);
    //     console.log(eachSprite.costumes);
    // }

    for (eachImage in assets) {
        let ext = eachImage.split('.').pop();
        if (imageExts.includes(ext)) {
            let filePath = tempFolder + "/" + eachImage;
            let watermarkFilePath = tempFolder + "/watermask/" + eachImage;
            await dw.transformImageWithText(filePath, watermarkText, fontSize, watermarkFilePath);
            let md5WatermarkFileName = md5(fs.readFileSync(watermarkFilePath)) + '.' + ext;
            let md5WatermarkFilePath = tempFolder + "/watermask/" + md5WatermarkFileName;
            // rename watermark file
            fs.renameSync(watermarkFilePath, md5WatermarkFilePath);
            assets[eachImage] = md5WatermarkFileName;
        }
    }
    // TODO: add sound watermarking
    for (eachSound in assets) {
        let ext = eachSound.split('.').pop();
        if (soundExts.includes(ext)) {
            let filePath = tempFolder + "/" + eachSound;
            let md5SoundFileName = md5(fs.readFileSync(filePath)) + '.' + ext;
            let md5SoundFilePath = tempFolder + "/watermask/" + md5SoundFileName;
            // rename sound file
            fs.renameSync(filePath, md5SoundFilePath);
            assets[eachSound] = md5SoundFileName;
        }
    }
    for (eachSprite of projectJson.targets) {
        console.log(eachSprite.name);
        // console.log(eachSprite.costumes);
        for (eachCostume of eachSprite.costumes) {
            console.log(eachCostume.md5ext);
            if (eachCostume.md5ext in assets) {
                eachCostume.assetId = assets[eachCostume.md5ext].split('.').shift()
                eachCostume.md5ext = assets[eachCostume.md5ext];
            }
        }
    }
    assets['project.json'] = 'project.json';
    console.log(assets);
    fs.writeFileSync(tempFolder + "/watermask/project.json", JSON.stringify(projectJson));
    // pack watermask folder to zip file
    let zip = new jszip();
    for (eachFile in assets) {
        console.log(eachFile,assets[eachFile]);
        zip.file(assets[eachFile], fs.readFileSync(tempFolder + "/watermask/" + assets[eachFile]));
    }
    let zipBuffer = await zip.generateAsync({
        type: 'nodebuffer',
        compression: 'DEFLATE'
    });
    fs.writeFileSync(tempFolder + "/watermask.sb3", zipBuffer);



}
read(zipFileName = "test/test.sb3")