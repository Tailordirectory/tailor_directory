const BusinessTypes = require("../../../classes/models-controllers/BusinessTypes");
const { getErrorObject } = require("../../../helpers/errors");

module.exports = async (req, res) => {
  const { query } = req;
  const queryFilter = query.filter || {};
  const limit = Number(query.limit) || 10;
  const offset = (Number(query.page) - 1) * limit || 0;
  const sort = {};

  try {
    if (query.name) {
      queryFilter.name = { $regex: new RegExp(query.name, "i") };
    }

    if (query.createdFrom && query.createdTo) {
      queryFilter.createdAt = {
        $gte: new Date(query.createdFrom),
        $lt: new Date(query.createdTo),
      };
    }

    if (query.sortBy && query.sortType) {
      sort[query.sortBy] = query.sortType === "asc" ? 1 : -1;
    } else sort["createdAt"] = -1;

    const businessTypes = await BusinessTypes.paginate(
      queryFilter,
      offset,
      limit,
      sort
    );

    res.json(businessTypes);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
