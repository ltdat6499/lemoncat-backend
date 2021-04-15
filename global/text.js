const fs = require("fs");

const readFile = (filePath) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (e) {
    return "ERROR";
  }
};

module.exports = {
  readFile,
};
