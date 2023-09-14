const Business = require("../../../classes/models-controllers/Business");
const { getErrorObject } = require("../../../helpers/errors");
const {
  Types: { ObjectId },
} = require("mongoose");
const { filteredProps } = require("../../../enums/business");

module.exports = async (req, res) => {
  const { query } = req;
  const queryFilter = query.filter || {};
  const limit = Number(query.limit) || 100;
  const offset = (Number(query.page) - 1) * limit || 0;
  const maxDistance = Number(query.maxDistance) || 100;
  const sort = {};
  const orFilter = {};

  try {
    if (query.sortBy && query.sortType) {
      sort[query.sortBy] = query.sortType === "asc" ? 1 : -1;
    }

    if (query["ownerId.profileType"]) {
      if (query["ownerId.profileType"] === "basic") {
        orFilter["$or"] = [
          { "ownerId.profileType": "basic" },
          { ownerId: null },
        ];
      } else orFilter["ownerId.profileType"] = query["ownerId.profileType"];
    }

    if (query.createdFrom && query.createdTo) {
      queryFilter.createdAt = {
        $gte: new Date(query.createdFrom),
        $lt: new Date(query.createdTo),
      };
    }

    for (const prop of filteredProps) {
      if (query[prop])
        queryFilter[prop] = { $regex: new RegExp(query[prop], "i") };
    }

    if (query.searchByCoordinates && (!query.latitude || !query.longitude)) {
      throw getErrorObject("coordinates_required", 400);
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
      orFilter,
      sort,
      isAdmin: true,
    });

    res.json(docs);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
