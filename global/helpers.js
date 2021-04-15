const fs = require("fs");
const faker = require("faker");

const readFile = (filePath) => {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (e) {
    return "ERROR";
  }
};

const nameGen = () => faker.name.findName();

const wordsGen = (number) => faker.lorem.words(number);

const emailGen = () => faker.internet.email();

const paragraphsGen = (number) => faker.lorem.paragraphs(number);

const encode = (file) => {
  const bitmap = fs.readFileSync(file);
  return new Buffer(bitmap).toString("base64");
};

const getRandom = (max) => {
  const result = Math.floor(1 + Math.random() * Math.floor(max));
  if (result < 10) return "0" + result;
  return result.toString();
};

const getRandomBetween = (min, max) => {
  const result = Math.floor(min + 1 + Math.random() * Math.floor(max));
  return result > max ? max : result;
};

module.exports = {
  encode,
  nameGen,
  readFile,
  wordsGen,
  emailGen,
  getRandom,
  paragraphsGen,
  getRandomBetween,
};
