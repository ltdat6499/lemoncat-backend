const _ = require("lodash");
const faker = require("faker");

const genJson = () => faker.datatype.json();

const genFakeId = () => faker.datatype.uuid();

const genAvatar = () => faker.image.avatar();

const genName = () => faker.name.findName();

const genWords = (number) => faker.lorem.words(number);

const genEmail = () => faker.internet.email();

const genTitle = () => faker.name.title();

const genParagraphs = (number) => faker.lorem.paragraphs(number);

const futureDateTypes = ["future", "recent", "soon"];

const genRandomFutureDate = () =>
  faker.date[_.head(_.shuffle(futureDateTypes))]();

const genRandomPastDate = () =>
  faker.date.between(new Date(1960, 1, 30), new Date(2000, 1, 30));

const genCountryName = () => faker.address.country();

const imageTypes = [
  "image",
  "abstract",
  "animals",
  "business",
  "city",
  "nightlife",
  "fashion",
  "people",
  "nature",
  "sports",
  "technics",
  "transport",
];

const genImages = (length) => {
  const list = [
    {
      id: genFakeId(),
      src: faker.image.image(),
    },
  ];
  for (let i = 1; i < length; i++) {
    list.push({
      id: genFakeId(),
      src: faker.image[_.head(_.shuffle(imageTypes))](),
    });
  }
  return list;
};

const genContent = () => {
  const content = faker.lorem.paragraphs(3, ". ");
  return {
    content,
    contentHtml: `<strong>${content}</strong>`,
  };
};

const genTags = (length = 10) => {
  const list = [];
  for (let i = 0; i < length; i++) list.push(faker.music.genre());
  return list;
};

module.exports = {
  genJson,
  genFakeId,
  genAvatar,
  genName,
  genWords,
  genEmail,
  genTitle,
  genParagraphs,
  genRandomFutureDate,
  genRandomPastDate,
  genCountryName,
  genImages,
  genContent,
  genTags,
};
