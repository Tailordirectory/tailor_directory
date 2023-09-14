require("../db/db");

const Tags = require("../models/Tags");
const tags = require("./tags.json");

async function a() {
  const mappedTags = tags.map((tag) => ({ name: tag }));

  await Tags.insertMany(mappedTags);
}

a()
  .catch(async (e) => {
    console.log(e);
    console.log("count", count);
  })
  .finally(() => {
    console.log("end");
    process.exit();
  });
