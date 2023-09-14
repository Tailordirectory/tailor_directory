#!/usr/bin/env node

require("../db/db");
const User = require("../classes/models-controllers/User");
const randomString = require("randomstring");
const Business = require("../classes/models-controllers/Business");
const Tags = require("../classes/models-controllers/Tags");
const { userRoles } = require("../enums/user");
const { businessTypes } = require("../enums/business");
const coordinatesArray = require("./coordinates");
const names = ["Oleg", "Ilia", "John", "Eugene", "Nick", "Max"];
const businessFirst = ["Super", "Mega", "Ultra", "Big", "Small"];
const businessLast = ["Ninja", "Clothes", "Tailor", "Craft", "Leather"];

const generateNumber = (length = 12) =>
  parseInt(
    randomString.generate({
      length,
      charset: "numeric",
    })
  );

const geneUser = (i, tagsArr) => ({
  email: randomString.generate(20) + "@tailors.com",
  password: randomString.generate(20),
  userName: randomString.generate(20),
  phones: [`+` + generateNumber(12)],
  city: "Berlin",
  country: "Germany",
  location: {
    type: "Point",
    coordinates: [
      coordinatesArray[i].coordinates[1],
      coordinatesArray[i].coordinates[0],
    ],
  },
  address: coordinatesArray[i].address,
  workTime: {
    start: {
      h: generateNumber(2) % 24,
      m: generateNumber(2) % 60,
    },
    end: {
      h: generateNumber(2) % 24,
      m: generateNumber(2) % 60,
    },
  },
  firstName: names[generateNumber(1) % names.length],
  lastName: names[generateNumber(1) % names.length],
  role: userRoles.BUSINESS,
  filledAt: Date.now(),
  verifiedAt: Date.now(),
  zipCode: generateNumber(5),
  businessName:
    businessFirst[generateNumber(2) % businessFirst.length] +
    " " +
    businessLast[generateNumber(2) % businessLast.length],
  businessType: Object.values(businessTypes)[generateNumber(2) % 2],
  tags: [
    tagsArr[generateNumber(1) % tagsArr.length]._id,
    tagsArr[generateNumber(2) % tagsArr.length]._id,
  ],
  rating: (generateNumber(2) % 5) + generateNumber(1) / 10,
  reviewsCount: generateNumber(2),
  media: [
    {
      url: "https://www.siamemporiumtailors.com/images/img1.jpg",
      type: "image/jpeg",
    },
  ],
});

async function a() {
  const tagsArr = await Tags.paginate({}, 0, 10);
  for (let i = 0; i < coordinatesArray.length - 1; i++) {
    const body = geneUser(i, tagsArr.docs);

    body.description = `My company name is ${body.businessName}. It's a company with a big history. My company specializes in ${body.businessType}`;

    const user = await User.create(body);
    body.ownerId = user._id;
    await Business.create(body).catch((err) => {
      console.log(err);
      User.deleteById(body.ownerId);
      throw err;
    });
    i += 1;
    const secondBusiness = geneUser(i, tagsArr.docs);
    secondBusiness.ownerId = user._id;
    secondBusiness.description = `My company name is ${secondBusiness.businessName}. It's a company with a big history. My company specializes in ${secondBusiness.businessType}`;
    await Business.create(secondBusiness).catch((err) => {
      console.log(err);
      User.deleteById(body.ownerId);
      throw err;
    });

    console.log(i);
  }
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
