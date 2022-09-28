/* eslint-disable @typescript-eslint/explicit-member-accessibility */
const moment = require("moment");

class DateUtil {
  static isAfter(date, dateToBeCompared) {
    const momentDate = moment(date);
    const momentDateToBeCompared = moment(dateToBeCompared);
    const isAfter = momentDate.isAfter(momentDateToBeCompared);
    return isAfter;
  }

  static add(date, amount, unit) {
    const momentDate = moment(date);
    momentDate.add(amount, unit);
    const toDate = momentDate.toDate();
    return toDate;
  }

  static setDateAndTime({ year, month, day, hour, minute, second }) {
    const dateFormat = `${month}-${day}-${year}`;
    const momentDate = moment(dateFormat, "MM-DD-YYYY");
    momentDate.set({
      hour,
      minute,
      second,
    });
    const toDate = momentDate.toDate();
    return toDate;
  }

  static getTimestamp() {
    const now = moment().format("YYYY-MM-DD hh:mm:ss a");
    return now;
  }
}

module.exports = DateUtil;
