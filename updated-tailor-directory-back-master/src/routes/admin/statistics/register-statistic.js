const User = require("../../../classes/models-controllers/User");
const { getErrorObject } = require("../../../helpers/errors");
const AccountType = require("../../../classes/profiles-acl");

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
    for (const type of AccountType.groups) {
      $facet[type] = [{ $match: { profileType: type } }, { $count: type }];
      $project[type] = { $arrayElemAt: [`$${type}.${type}`, 0] };
    }

    const users = await User.model.aggregate([
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

    for (const type of AccountType.groups) {
      if (!users[0][type]) {
        users[0][type] = 0;
      }
    }

    res.json(users[0]);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
