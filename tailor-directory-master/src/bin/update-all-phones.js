#!/usr/bin/env node

require("../db/db");
const Business = require("../models/Bussiness");
const parsePhone = require("../helpers/parse-phone");

async function updatePhones(offset = 0, limit = 500) {
  const businesses = await Business.find({}).limit(limit).skip(offset);
  console.log("starting:", offset, offset + 500);
  for (const business of businesses) {
    const newPhones = [];
    for (let phone of business.phones) {
      if (typeof phone === "string") {
        newPhones.push(parsePhone(phone));
      } else newPhones.push(phone);
    }
    console.log(business.phones, business.phone);
    if (!business.phones.length && business.phone) {
      newPhones.push(parsePhone(business.phone));
    }
    console.log(newPhones);
    business.phones = newPhones;
    try {
      await business.save();
    } catch (error) {}
  }

  if (businesses.length === 500) {
    return updatePhones(offset + limit, limit);
  }
}

updatePhones().catch((err) => {
  console.log(err);
});
