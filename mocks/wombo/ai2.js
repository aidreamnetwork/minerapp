const fetch = require("node-fetch");
const fs = require('fs');
const wombo = require("./womboai");
const downloadFile = (async (url, path) => {
    const res = await fetch(url);
    const fileStream = fs.createWriteStream(path);
    await new Promise((resolve, reject) => {
        res.body.pipe(fileStream);
        res.body.on("error", reject);
        fileStream.on("finish", resolve);
      });
  });

(async function() {
    const myArgs = process.argv.slice(2);
    let prompt = myArgs[0]
    let filePath = myArgs[1]
    // ai2.js <Prompt> outputfile style
    let url = await wombo(prompt);
    await downloadFile(url,filePath );
    console.log("File saved to "+ filePath);
})()