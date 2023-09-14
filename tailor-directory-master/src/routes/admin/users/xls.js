const User = require('../../../classes/models-controllers/User');
const { getErrorObject } = require('../../../helpers/errors');
const { createFull: createXls } = require('../../../helpers/create-xls');
const { filterPropsForAdmin } = require('../../../enums/user');

module.exports = async (req, res) => {
  const { query } = req;
  const sort = {};

  if (query.sortBy && query.sortType) {
    sort[query.sortBy] = query.sortType;
  }

  const filter = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const prop of filterPropsForAdmin) {
    if (query[prop]) filter[prop] = { $regex: new RegExp(query[prop], 'i') };
  }
  if (query.profileType) filter.profileType = query.profileType;

  if (query.createdFrom && query.createdTo) {
    filter.createdAt = {
      $gte: query.createdFrom,
      $lt: query.createdTo,
    };
  }

  try {
    const docs = await User.model.find(filter);

    createXls('owners', docs, res, ['assignedTerms']);
  } catch (error) {
    throw getErrorObject('general_error', 500, error);
  }
};
