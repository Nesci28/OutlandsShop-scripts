/* eslint-disable no-console */
const axios = require("axios");
const { program } = require("commander");
const cronTime = require("cron-time-generator");
const FormData = require("form-data");
const fs = require("fs");
const cron = require("node-cron");
const Os = require("os");
const sudo = require("sudo-prompt");
const wdl = require("windows-drive-letters");

const Upload = require("./upload.js");

const URL = "https://api.outlands.shop/vendor?timezone=";

async function main(directory) {
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  await shadowCopy(directory);

  const url = `${URL}${timeZone}`;
  const upload = new Upload("./logs");

  const fileName = await upload.getLatestFilename();
  const file = fs.readFileSync(`./logs/${fileName}`);
  const formData = new FormData();
  formData.append("file", file, "file.txt");

  try {
    const res = await axios.post(url, formData);
    console.log(
      `success: ${res.data.isSuccess} - items: ${res.data.value.length}`,
    );
  } catch (err) {
    console.log("err :>> ", err.response.data.error.message);
  }
}

program
  .requiredOption(
    "-d, --directory <string>",
    "directory to the Journal Log files",
  )
  .option("-h, --hours <number>", "Every X Hours", 2);

program.parse(process.argv);
const { directory, hours } = program.opts();

const cronExpression = cronTime.every(+hours).hours();

(async () => {
  await main(directory);
})();

cron.schedule(cronExpression, async () => {
  await main(directory);
});

async function shadowCopy(dir) {
  console.log("dir :>> ", dir);
  const freeLetters = wdl.freeSync();
  const letter = freeLetters[0];

  const subDir = dir.substring(3);
  console.log("subDir :>> ", subDir);

  const arch = Os.arch() === "x64" ? "64" : "32";

  const data = `xcopy /s "${letter}:\\${subDir}" "./logs"`;
  fs.writeFileSync("./ShadowTask/copy_logs.bat", data);

  return new Promise((resolve, reject) => {
    sudo.exec(
      `./ShadowTask/ShadowTask${arch}.exe ${dir} ${letter} ./ShadowTask/copy_logs.bat`,
      {},
      (error, stdout) => {
        if (error) {
          reject(error);
        }

        resolve(stdout);
      },
    );
  });
}
