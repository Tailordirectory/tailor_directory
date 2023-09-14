const ClaimRequest = require("../../../classes/models-controllers/ClaimRequest");
const Business = require("../../../classes/models-controllers/Business");
const User = require("../../../classes/models-controllers/User");
const { getErrorObject } = require("../../../helpers/errors");
const { filteredProps, userSelect, businessSelect } = require("../../../enums/claim-request");

module.exports = async (req, res) => {
  const { query } = req;
  const queryFilter = {};
  const limit = Number(query.limit) || 10;
  const page = Number(query.page) || 1;
  const sort = {};

  try {
    if (query.sortBy && query.sortType) {
      sort[query.sortBy] = query.sortType === "asc" ? 1 : -1;
    } else sort["createdAt"] = -1;

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

    const claims = await ClaimRequest.model.aggregate([
      {
        $lookup: {
          from: Business.model.collection.collectionName,
          let: { businessId: "$businessId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$businessId"] } } },
            { $project: businessSelect },
          ],
          as: "businessId",
        },
      },
      {
        $unwind: {
          path: "$businessId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: User.model.collection.collectionName,
          let: { userId: "$userId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$userId"] } } },
            { $project: userSelect },
          ],
          as: "userId",
        },
      },
      {
        $unwind: {
          path: "$userId",
          preserveNullAndEmptyArrays: true,
        },
      },
      { $sort: sort },
      { $match: queryFilter },
      {
        $facet: {
          metadata: [{ $count: "total" }, { $addFields: { page } }],
          data: [{ $skip: (page - 1) * limit }, { $limit: limit }],
        },
      },
    ]);

    const response = { docs: claims[0].data, ...claims[0].metadata[0], limit };

    res.json(response);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
