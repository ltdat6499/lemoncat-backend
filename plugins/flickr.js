const Flickr = require("flickr-sdk");
const { flickr } = require("../configs");

const server = new Flickr(flickr.consumerKey);
const auth = Flickr.OAuth.createPlugin(
  flickr.consumerKey,
  flickr.consumerSecret,
  flickr.oauthToken,
  flickr.oauthSecret
);

const upload = async (name) => {
  const run = new Flickr.Upload(auth, `${__dirname}/../public/${name}`, {
    title: "createdAt: " + Date.now(),
  });
  const id = await run
    .then(({ body }) => body.photoid._content)
    .catch((err) => {
      console.log("Flickr upload: ", err);
      return null;
    });
  return server.photos
    .getInfo({
      photo_id: id,
    })
    .then((res) => {
      const { id, server, originalsecret, secret } = res.body.photo;
      return {
        id,
        url: `https://live.staticflickr.com/${server}/${id}_${originalsecret}_o.jpg`,
        originalsecret,
        secret,
      };
    })
    .catch((err) => {
      console.error("Flickr upload: ", err);
      return null;
    });
};

const update = (id, name) => {
  const run = new Flickr.Replace(
    auth,
    id,
    `${__dirname}/../public/${name}`,
    {
      title: "updatedAt: " + Date.now(),
    }
  );
  return run
    .then((res) => res.body.photoid)
    .catch((err) => {
      console.error("Flickr update: ", err);
      return null;
    });
};

module.exports = {
  upload,
  update,
};
