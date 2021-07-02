const fs = require("fs");
const axios = require("axios");

const url =
  "https://www.rottentomatoes.com/napi/search/all?type=tv&searchQuery=a&after=";

const fetchData = async (url) => {
  try {
    let response;
    response = await axios({
      url,
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const run = async () => {
  let endCursor = "MTAw";
  while (endCursor.length) {
    let data = await fetchData(url + endCursor);
    endCursor = data.tvs.pageInfo.endCursor;
    for (const item of data.tvs.items) {
      await fs.appendFileSync(
        "results.txt",
        JSON.stringify(item) + "\n",
        "utf8"
      );
    }
    console.log(endCursor);
  }
};

run();
