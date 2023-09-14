const Business = require('../../../classes/models-controllers/Business');
const { getErrorObject } = require('../../../helpers/errors');
const { createFull: createXls } = require('../../../helpers/create-xls');
const { filteredProps } = require('../../../enums/business');

module.exports = async (req, res) => {
  const { query } = req;

  const sort = {};

  if (query.sortBy && query.sortType) {
    sort[query.sortBy] = query.sortType;
  }

  const filter = {};

  // eslint-disable-next-line no-restricted-syntax
  for (const prop of filteredProps) {
    if (query[prop]) filter[prop] = { $regex: new RegExp(query[prop], 'i') };
  }

  if (query.createdFrom && query.createdTo) {
    filter.createdAt = {
      $gte: query.createdFrom,
      $lt: query.createdTo,
    };
  }

  try {
    const docs = await Business.model.find(filter);
    createXls('business', docs, res);
  } catch (error) {
    throw getErrorObject('general_error', 500, error);
  }
};
