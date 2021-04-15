var faker = require("faker");

const nameGen = () => faker.name.findName();

const wordsGen = (number) => faker.lorem.words(number);

const emailGen = () => faker.internet.email();

const paragraphsGen = (number) => faker.lorem.paragraphs(number);

module.exports = {
  nameGen,
  paragraphsGen,
  emailGen,
  wordsGen,
};
