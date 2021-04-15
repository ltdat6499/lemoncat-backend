const fs = require("fs");

const encode = (file) => {
  const bitmap = fs.readFileSync(file);
  return new Buffer(bitmap).toString("base64");
};

module.exports = {
  encode,
};
