const Flickr = require("flickr-sdk");

const auth = Flickr.OAuth.createPlugin(
  "6923e3fd61138e47da34f15566084be7",
  "01ae14a02a1b8a1c",
  "72157718960824487-9fac97c188cfcbd6",
  "c22bf811bfda795e"
);

// const upload = new Flickr.Upload(auth, "./sample.png", {
//   title: "Works on MY machine!",
// });

// upload
//   .then(function (res) {
//     console.log("res", res.body);
//   })
//   .catch(function (err) {
//     console.log("err", err);
//   });

//------------------------------------------------------------------------------

var flickr = new Flickr("6923e3fd61138e47da34f15566084be7");

flickr.photos
  .getInfo({
    photo_id: 51120394137,
  })
  .then(function (res) {
    const { id, server, originalsecret } = res.body.photo;
    console.log(
      `https://live.staticflickr.com/${server}/${id}_${originalsecret}_o.jpg`
    );
    return `https://live.staticflickr.com/${server}/${id}_${originalsecret}_o.jpg`;
  })
  .catch(function (err) {
    console.error("bonk", err);
  });

//------------------------------------------------------------------------------

// var replace = new Flickr.Replace(auth, 51120394137, "./replace.jpg", {
//   title: "Now in pink!",
// });

// replace
//   .then(function (res) {
//     /*
//     {
//   stat: 'ok',
//   photoid: {
//     _content: '51120394137',
//     secret: '99f8605619',
//     originalsecret: '0dfbcf070c'
//   }
// }
//     */
//     console.log("yay!", res.body);
//   })
//   .catch(function (err) {
//     console.error("bonk", err);
//   });
