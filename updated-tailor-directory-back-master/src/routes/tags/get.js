const Tags = require("../../classes/models-controllers/Tags");
const { getErrorObject } = require("../../helpers/errors");

module.exports = async (req, res) => {
  const { query } = req;
  const queryFilter = query.filter || {};
  const limit = Number(query.limit) || 10;
  const offset = (Number(query.page) - 1) * limit || 0;

  try {
    const tags = await Tags.paginate(queryFilter, offset, limit, query.sort);

    res.json(tags);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
