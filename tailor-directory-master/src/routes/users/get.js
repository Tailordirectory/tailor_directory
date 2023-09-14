const User = require('../../classes/models-controllers/User');
const { getErrorObject } = require('../../helpers/errors');

module.exports = async (req, res) => {
  const { query } = req;
  const queryFilter = query.filter || {};
  const offset = Number(query.offset) || 0;
  const limit = Number(query.limit) || 10;

  try {
    const users = await User.paginate(queryFilter, offset, limit, query.sort);

    res.json(users);
  } catch (error) {
    throw getErrorObject('general_error', 500, error);
  }
};
