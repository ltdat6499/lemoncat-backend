const fs = require("fs");
const readline = require("readline");
const tf = require("@tensorflow/tfjs");
const _ = require("lodash");
const wilsonScore = require("wilson-score-rank");
const Excel = require("exceljs");
const genid = require("genid");
let workbook = new Excel.Workbook();

const bayes = require("bayes");
const classifier = bayes();

const loadArray = async (path) => {
  const file = fs.createReadStream(path);

  const readLine = readline.createInterface({
    input: file,
    crlfDelay: Infinity,
  });
  const results = [];
  for await (const line of readLine) {
    results.push(line);
  }
  return results;
};

const training = async () => {
  const positives = await loadArray(__dirname + "/positive.txt");
  for (const item of positives) {
    await classifier.learn(item, "positive");
  }
  const negatives = await loadArray(__dirname + "/negative.txt");
  for (const item of negatives) {
    await classifier.learn(item, "negative");
  }
  const spams = await loadArray(__dirname + "/spam.txt");
  for (const item of spams) {
    await classifier.learn(item, "spam");
  }
  const bads = await loadArray(__dirname + "/bad.txt");
  for (const item of bads) {
    await classifier.learn(item, "bad");
  }
};

const checkComment = async (comment) => await classifier.categorize(comment);

const exportModel = () => classifier.toJson();

const importModel = (model) => {
  bayes.fromJson(model);
};

const tranformInput = (data) => {
  const array = data.split("");
  const results = [];
  for (const item of array) {
    results.push(item.charCodeAt(0));
  }
  while (results.length < 27) results.push(0);
  return results;
};

const tensorTraning = async () => {
  // convert/setup our data
  const positives = await loadArray("positive.txt");
  let results = positives.map((item) => ({
    content: tranformInput(item),
    sentiment: "positive",
  }));

  const negatives = await loadArray("negative.txt");
  results = results.concat(
    negatives.map((item) => ({
      content: tranformInput(item),
      sentiment: "negative",
    }))
  );
  const trainingData = tf.tensor2d(results.map((item) => item.content));
  const outputData = tf.tensor2d(
    results.map((item) => [
      item.sentiment === "positive" ? 1 : 0,
      item.sentiment === "negative" ? 1 : 0,
    ])
  );
  const tests = ["fuck u ", "nice", "good job, asshole"];
  const testingData = tf.tensor2d(tests.map((test) => tranformInput(test)));
  // build neural network
  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      inputShape: [27],
      activation: "sigmoid",
      units: 100,
    })
  );
  model.add(
    tf.layers.dense({
      inputShape: [100],
      activation: "sigmoid",
      units: 2,
    })
  );
  model.add(
    tf.layers.dense({
      activation: "sigmoid",
      units: 2,
    })
  );
  model.compile({
    loss: "meanSquaredError",
    optimizer: tf.train.adam(0.06),
  });
  // train/fit our network
  console.log("Training...");
  model.fit(trainingData, outputData, { epochs: 1 }).then((history) => {
    console.log(history);
    model.predict(testingData).print();
  });
  // test network
};

// Normal: Random choose
const interactMapping = [4, 3, 2, 1, -2, -4];
const userMapping = [
  0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 100,
];
const contentMapping = [
  -1, -1, -1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
];

// Spam + Buff <Positive> + 90% detected as spam
// const interactMapping = [4, 3];
// const userMapping = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
// const contentMapping = [0, 0, 0, 1, 1, 1, 1, 1, 1, 1];

// Spam + Buff <Negative> + 90% detected as spam
// const interactMapping = [-4, -2];
// const userMapping = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
// const contentMapping = [0, 0, 0, -1, -1, -1, -1, -1, -1, 1];

// Spam + Buff <Positive> + 40% detected as spam
// const interactMapping = [4, 3, -2, -4];
// const userMapping = [0, 0, 0, 0, 1, 1, 1, 1, 1, 100];
// const contentMapping = [0, 0, 0, 1, 1, 1, -1, -1, -1, -1];

// Spam + Buff <Negative> + 40% detected as spam
// const interactMapping = [4, 3, -2, -4];
// const userMapping = [0, 0, 0, 0, 1, 1, 1, 1, 1, 100];
// const contentMapping = [0, 0, 0, 1, 1, 1, 1, -1, -1, 1];

const genComment = (parent) => ({
  id: genid(32),
  type: "comment",
  parent,
  user: _.shuffle(userMapping)[0],
  data: _.shuffle(contentMapping)[0],
});

const genInteract = (parent) => ({
  id: "",
  type: "interact",
  parent: parent,
  user: _.shuffle(userMapping)[0],
  data: _.shuffle(interactMapping)[0],
});

const genComments = (parent, size) => {
  const comments = [];
  while (comments.length < size) comments.push(genComment(parent));
  return comments;
};

const genInteracts = (parent, size) => {
  const interacts = [];
  while (interacts.length < size) interacts.push(genInteract(parent));
  return interacts;
};

const calculateScore = (interacts, comments = []) => {
  let total = 0,
    positive = 0,
    spam = 0;
  for (const interact of interacts) {
    if (interact.user !== 0) {
      if (interact.data > 0) {
        positive += interact.data * interact.user;
      }
      total += Math.abs(interact.data * interact.user);
    } else spam++;
  }
  for (const comment of comments) {
    if (comment.user !== 0) {
      if (comment.data > 0) {
        positive += comment.data * comment.user;
      }
      total += Math.abs(comment.data * comment.user);
    } else spam++;
  }
  return {
    score: wilsonScore.lowerBound(positive, total),
    total,
    positive,
    spam,
  };
};

const genData = async () => {
  // training();
  // target post: comments + interacts
  let comments = genComments("post", 100),
    interacts = genInteracts("post", 100);

  // target comment: childComment + interacts
  let childComments = [];
  for (const comment of comments) {
    childComments = childComments.concat(genComments(comment.id, 10));
    interacts = interacts.concat(genInteracts(comment.id, 10));
  }

  // target childComment: interacts
  for (const comment of childComments) {
    interacts = interacts.concat(genInteracts(comment.id, 10));
  }

  //mapScore
  for (const comment of childComments) {
    const interactData = interacts.filter(
      (interact) => interact.parent === comment.id
    );

    comment.score = comment.user === 0 ? 0 : calculateScore(interactData).score;
  }

  for (const comment of comments) {
    const interactData = interacts.filter(
      (interact) => interact.parent === comment.id
    );

    const commentData = childComments.filter(
      (item) => item.parent === comment.id
    );

    comment.score =
      comment.user === 0 ? 0 : calculateScore(interactData, commentData).score;
  }

  const { score, total, positive, spam } = calculateScore(interacts, comments);

  return {
    interacts,
    comments: comments.concat(childComments),
    score,
    total,
    positive,
    spam,
  };
};

// run();

// const data = [
//   { company: "Microsoft", size: 91259, revenue: 60420 },
//   { company: "IBM", size: 400000, revenue: 98787 },
//   { company: "Skype", size: 700, revenue: 716 },
//   { company: "SAP", size: 48000, revenue: 11567 },
//   { company: "Yahoo!", size: 14000, revenue: 6426 },
//   { company: "eBay", size: 15000, revenue: 8700 },
// ];

// // Create the data 2D-array (vectors) describing the data
// let vectors = new Array();
// for (let i = 0; i < data.length; i++) {
//   vectors[i] = [data[i]["size"], data[i]["revenue"]];
// }

// const kmeans = require("node-kmeans");
// kmeans.clusterize(vectors, { k: 2 }, (err, res) => {
//   if (err) console.error(err);
//   else console.log("%o", res);
// });

const exportUI = async () => {
  for (let index = 0; index < 10; index++) {
    let worksheet = workbook.addWorksheet("normal " + index);
    worksheet.columns = [
      { header: "ID", key: "id" },
      { header: "Parent", key: "parent" },
      { header: "Type", key: "type" },
      { header: "User", key: "user" },
      { header: "Data", key: "data" },
      { header: "Wilson", key: "score" },
      { header: "", key: "empty" },
      { header: "Post Score", key: "postScore" },
      { header: "Total", key: "total" },
      { header: "Positive", key: "positive" },
      { header: "Spam", key: "spam" },
    ];
    worksheet.columns.forEach((column) => {
      column.width = column.header.length < 12 ? 12 : column.header.length;
    });
    const { interacts, comments, score, total, positive, spam } =
      await genData();
    const data = [];
    let first = true;
    for (const item of comments) {
      if (first) {
        data.push({
          id: item.id,
          parent: item.parent,
          type: item.type,
          user: item.user,
          data: item.data,
          score: item.score,
          empty: "",
          postScore: spam / total >= 0.5 && positive / total > 0.5 ? 0 : score,
          total,
          positive,
          spam,
        });
        first = false;
      } else {
        data.push({
          id: item.id,
          parent: item.parent,
          type: item.type,
          user: item.user,
          data: item.data,
          score: item.score,
          empty: "",
          postScore: "",
          total: "",
          positive: "",
          spam: "",
        });
      }
    }
    for (const item of interacts) {
      data.push({
        id: item.id,
        parent: item.parent,
        type: item.type,
        user: item.user,
        data: item.data,
        score: Math.abs(item.user * item.data),
        empty: "",
        postScore: "",
        total: "",
        positive: "",
        spam: "",
      });
    }
    data.forEach((e, index) => {
      worksheet.addRow({
        ...e,
      });
    });
  }
  await workbook.xlsx.writeFile("test.xlsx");
  console.log("DONE");
};

exportUI();

module.exports = {
  checkComment,
  exportModel,
  importModel,
  tensorTraning,
};
