const uuid = require("uuid");

const genId = () => {
  const v1Options = {
    node: [0x01, 0x23, 0x45, 0x67, 0x89, 0xab],
    clockseq: 0x1234,
    msecs: new Date().getTime(),
    nsecs: 5678,
  };
  return uuid.v1(v1Options);
};

module.exports = {
  genId,
};
