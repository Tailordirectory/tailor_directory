#!/usr/bin/env node

require("../db/db");
const Business = require("../classes/models-controllers/Business");
const { createdByTypes } = require("../enums/business");

Business.model
  .updateMany(
    { $or: [{ ownerId: null }, { ownerId: { $exists: false } }] },
    { $set: { createdBy: createdByTypes.ADMIN } }
  )
  .then(async () => {
    await Business.model
      .updateMany(
        { ownerId: { $exists: true, $ne: null } },
        { $set: { createdBy: createdByTypes.OWNER } }
      )
      .then(console.log)
      .catch(console.log);
    console.log("deleted");
    process.exit();
  })
  .catch((e) => {
    console.log("delete failed");
    process.exit();
  });
