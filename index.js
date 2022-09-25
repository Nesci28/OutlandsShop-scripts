/* eslint-disable no-console */
const fs = require("fs");
const axios = require("axios");
const { program } = require("commander");
const FormData = require("form-data");
const cron = require("node-cron");
const cronTime = require("cron-time-generator");

const Upload = require("./upload.js");

const URL = "https://api.outlands.shop/vendor?timezone=";

async function main(folder) {
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  const url = `${URL}${timeZone}`;
  const upload = new Upload(folder);

  const fileName = await upload.getLatestFilename();
  const file = fs.readFileSync(`${folder}/${fileName}`);
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
cron.schedule(cronExpression, async () => {
  await main(directory);
});
