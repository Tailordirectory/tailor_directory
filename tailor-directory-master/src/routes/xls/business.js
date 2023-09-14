const { Types: { ObjectId } } = require('mongoose');
const Business = require('../../classes/models-controllers/Business');
const { getErrorObject } = require('../../helpers/errors');
const { createFull: createXls } = require('../../helpers/create-xls');

module.exports = async (req, res) => {
  const { query } = req;
  const queryFilter = query.filter || {};
  const offset = Number(query.offset) || 0;
  const limit = Number(query.limit) || 100;
  const maxDistance = Number(query.maxDistance) || 100;

  try {
    if (query.searchByCoordinates && (!query.latitude || !query.longitude)) {
      throw getErrorObject('coordinates_required', 400);
    }

    if (query.businessType) {
      if (!Array.isArray(query.businessType)) {
        query.businessType = [query.businessType];
      }
      queryFilter.businessType = { $in: query.businessType };
    }

    if (query.tags) {
      if (!Array.isArray(query.tags)) {
        query.tags = [query.tags];
      }

      queryFilter.tags = { $all: query.tags.map(tag => new ObjectId(tag)) };
    }

    const { docs } = await Business.findByLocationForXls({
      filter: queryFilter,
      maxDistance,
      y: parseFloat(query.latitude),
      x: parseFloat(query.longitude),
      limit,
      skip: offset,
      geoSearch: query.searchByCoordinates
    });

    createXls(docs, res);
  } catch (error) {
    throw getErrorObject('general_error', 500, error);
  }
};
