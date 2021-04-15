const fs = require("fs");
const faker = require("faker");

const encode = (file) => {
  const bitmap = fs.readFileSync(file);
  return new Buffer(bitmap).toString("base64");
};

const nameGen = () => faker.name.findName();

const wordsGen = (number) => faker.lorem.words(number);

const emailGen = () => faker.internet.email();

const paragraphsGen = (number) => faker.lorem.paragraphs(number);

const getRandom = (max) => {
  return Math.floor(1 + Math.random() * Math.floor(max));
};
const getRandomBetween = (min, max) => {
  const result = Math.floor(min + 1 + Math.random() * Math.floor(max));
  return result > max ? max : result;
};

module.exports = {
  encode,
  nameGen,
  paragraphsGen,
  emailGen,
  wordsGen,
  getRandom,
  getRandomBetween,
};
