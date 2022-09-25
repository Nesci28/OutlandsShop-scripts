/* eslint-disable @typescript-eslint/explicit-member-accessibility */
const fs = require("fs");

const DateUtil = require("./date-util.js");

class Upload {
  folder;

  constructor(folder) {
    this.folder = folder;
  }

  async getLatestFilename() {
    const fileNames = await this.getFileNames();
    let latestFileName;
    const highestDate = DateUtil.add(new Date(), -1, "year");

    for (let i = 0; i < fileNames.length; i += 1) {
      const fileName = fileNames[i];
      const [year, month, day, hour, minute, second] = fileName.split("_");
      const date = DateUtil.setDateAndTime({
        year,
        month,
        day,
        hour,
        minute,
        second,
      });
      const isDateAfter = DateUtil.isAfter(date, highestDate);
      if (isDateAfter) {
        latestFileName = fileName;
      }
    }

    return latestFileName;
  }

  getFileNames() {
    const fileNames = fs.readdirSync(this.folder).reduce((accu, curr) => {
      const isJournal =
        /[0-9]{4}_[0-9]{2}_[0-9]{2}_[0-9]{2}_[0-9]{2}_[0-9]{2}_journal/.test(
          curr,
        );
      if (isJournal) {
        accu.push(curr);
      }

      return accu;
    }, []);

    return fileNames;
  }
}

module.exports = Upload;
