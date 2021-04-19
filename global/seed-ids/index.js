const requireText = require("require-text");
module.exports = {
  postIds: JSON.parse(requireText("./posts.json", require)),
  commentIds: JSON.parse(requireText("./comments.json", require)),
  personIds: JSON.parse(requireText("./persons.json", require)),
  userIds: JSON.parse(requireText("./users.json", require)),
  movieIds: JSON.parse(requireText("./movies.json", require)),
  randomIds: JSON.parse(requireText("./ids.json", require)),
};
