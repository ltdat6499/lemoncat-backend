const getRandom = (max) => {
  return Math.floor(1 + Math.random() * Math.floor(max));
};
const getRandomBetween = (min, max) => {
  const result = Math.floor(min + 1 + Math.random() * Math.floor(max));
  return result > max ? max : result;
};
module.exports = {
  getRandom,
  getRandomBetween,
};
