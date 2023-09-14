const Business = require("../../classes/models-controllers/Business");
const { getErrorObject } = require("../../helpers/errors");
const {
  Types: { ObjectId },
} = require("mongoose");

module.exports = async (req, res) => {
  const { query } = req;
  const queryFilter = query.filter || {};
  const limit = Number(query.limit) || 100;
  const offset = (Number(query.page) - 1) * limit || 0;
  const maxDistance = Number(query.maxDistance) || 100;

  try {
    if (query.searchByCoordinates && (!query.latitude || !query.longitude)) {
      throw getErrorObject("coordinates_required", 400);
    }

    if (query["businessTypeId.name"]) {
      if (!Array.isArray(query["businessTypeId.name"])) {
        query["businessTypeId.name"] = [query["businessTypeId.name"]];
      }
      queryFilter["businessTypeId.name"] = {
        $in: query["businessTypeId.name"],
      };
    }

    if (query.tags) {
      if (!Array.isArray(query.tags)) {
        query.tags = [query.tags];
      }
      queryFilter.tags = { $all: query.tags.map((tag) => new ObjectId(tag)) };
    }

    const docs = await Business.findByLocation({
      filter: queryFilter,
      maxDistance: maxDistance,
      y: parseFloat(query.latitude),
      x: parseFloat(query.longitude),
      limit: limit,
      skip: offset,
      geoSearch: query.searchByCoordinates,
    });

    res.json(docs);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
