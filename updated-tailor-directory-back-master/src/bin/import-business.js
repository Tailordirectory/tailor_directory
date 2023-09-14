#!/usr/bin/env node

require("../db/db");
const Business = require("../classes/models-controllers/Business");
const Tags = require("../classes/models-controllers/Tags");
const business = require("./data-with-tags.json");

async function a() {
  const tagsArr = await Tags.paginate({}, 0, 1000);
  const tagNames = {};
  const newArr = [];

  for (const { _id, name } of tagsArr.docs) {
    tagNames[name] = _id;
  }
  let withoutCoordinatesCount = 0;

  for (const object of business) {
    console.log("next");
    const newTags = [];
    for (const tag of object.tags) {
      newTags.push(tagNames[tag]);
    }
    object.tags = newTags;
    if (object.phone) {
      object.phones = [];
      object.phones.push(object.phone);
    }
    if (!object.city) object.city = "Hünenberg";
    if (!object.address) object.address = "undefined";
    if (!object.location.coordinates[0]) {
      object.location.coordinates = [0, 0];
      withoutCoordinatesCount++;
    }
    newArr.push(object);
  }

  console.log(withoutCoordinatesCount);

  await Business.model.insertMany(newArr);
}

a()
  .catch(async (e) => {
    console.log(e);
    const count = await User.count({}).catch((err) => {
      console.log(err);
    });
    console.log("count", count);
  })
  .finally(() => {
    console.log("end");
    process.exit();
  });
