const _ = require("lodash");
const fs = require("fs");
const request = require("request");
const changeCase = require("change-case");

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

module.exports = {
  ...require("./password"),
  changeCaseType,
  deepClone,
  download,
  deleteFile,
  _,
};
