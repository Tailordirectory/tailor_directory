const Business = require("../../../classes/models-controllers/Business");
const { getErrorObject } = require("../../../helpers/errors");
const AccountType = require("../../../classes/profiles-acl");
const { createdByTypes } = require("../../../enums/business");

module.exports = async (req, res) => {
  const { query } = req;
  const filter = {};

  if (query.createdFrom && query.createdTo) {
    filter.createdAt = {
      $gte: new Date(query.createdFrom),
      $lt: new Date(query.createdTo),
    };
  }

  try {
    const $facet = {};
    const $project = {};
    for (const type of Object.values(createdByTypes)) {
      $facet[type] = [{ $match: { createdBy: type } }, { $count: type }];
      $project[type] = { $arrayElemAt: [`$${type}.${type}`, 0] };
    }

    const businesses = await Business.model.aggregate([
      {
        $match: filter,
      },
      {
        $facet,
      },
      {
        $project,
      },
    ]);

    for (const type of Object.values(createdByTypes)) {
      if (!businesses[0][type]) {
        businesses[0][type] = 0;
      }
    }

    res.json(businesses[0]);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
