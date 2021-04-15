const getRandom = (max) => {
  const result = Math.floor(1 + Math.random() * Math.floor(max));
  if (result < 10) return "0" + result;
  return result.toString();
};

module.exports = {
  birthDate: `${getRandom(31)}/${getRandom(12)}/${
    parseInt(getRandom(100)) + 1900
  }`,
  theater: `${getRandom(31)}/${getRandom(12)}/${
    parseInt(getRandom(50)) + 2020
  }`,
  post: `${getRandom(31)}/${getRandom(12)}/${
    parseInt(getRandom(30)) + 2000
  }`,
};
