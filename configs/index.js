module.exports = {
  ...require("./db"),
  ...require("./jwt"),
  ...require("./server"),
  ...require("./flickr"),
  ...require("./facebook"),
  ...require("./google"),
};
