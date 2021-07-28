const fs = require("fs");
const request = require("request");
const moment = require("moment");
const changeCase = require("change-case");
// const { convert } = require("html-to-text");
const striptags = require("striptags");
// const ml = require("./machine-learning");

const deepClone = (instance) => JSON.parse(JSON.stringify(instance));

const changeCaseType = (items, type) => {
  for (const key in items) {
    const newKey = changeCase[type](key);
    if (newKey !== key) {
      items[newKey] = items[key];
      delete items[key];
    }
  }
  return items;
};

const download = (url, path, callback) => {
  request.head(url, (err, res, body) => {
    request(url).pipe(fs.createWriteStream(path)).on("close", callback);
  });
};

const deleteFile = async (path) => {
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
      return;
    }
    return true;
  });
};

const formatLLToDefault = (data) => moment(data).format().toString();

const htmlToText = (data) => striptags(data);

module.exports = {
  ...require("./password"),
  changeCaseType,
  deepClone,
  download,
  deleteFile,
  formatLLToDefault,
  htmlToText,
  // ml,
};
