const User = require("../../../classes/models-controllers/User");
const { getErrorObject } = require("../../../helpers/errors");
const { filterPropsForAdmin } = require("../../../enums/user");

module.exports = async (req, res) => {
  const { query } = req;
  const limit = Number(query.limit) || 10;
  const offset = (Number(query.page) - 1) * limit || 0;
  const sort = {};

  if (query.sortBy && query.sortType) {
    sort[query.sortBy] = query.sortType;
  }

  const filter = {};

  for (const prop of filterPropsForAdmin) {
    if (query[prop]) filter[prop] = { $regex: new RegExp(query[prop], "i") };
  }
  if (query.profileType) filter.profileType = query.profileType;

  if (query.createdFrom && query.createdTo) {
    filter.createdAt = {
      $gte: query.createdFrom,
      $lt: query.createdTo,
    };
  }

  try {
    const users = await User.paginate(filter, offset, limit, sort);

    res.json(users);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
