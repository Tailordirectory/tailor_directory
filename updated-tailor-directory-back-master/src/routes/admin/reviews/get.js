const Reviews = require("../../../classes/models-controllers/Review");
const Business = require("../../../classes/models-controllers/Business");
const User = require("../../../classes/models-controllers/User");
const { getErrorObject } = require("../../../helpers/errors");
const { filteredProps } = require("../../../enums/reviews");

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

    const reviews = await Reviews.model.aggregate([
      {
        $lookup: {
          from: Business.model.collection.collectionName,
          let: { businessId: "$businessId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$businessId"] } } },
            { $project: { businessName: 1, _id: 1 } },
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
            { $project: { firstName: 1, lastName: 1, username: 1, _id: 1 } },
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

    const response = { docs: reviews[0].data, ...reviews[0].metadata[0], limit };

    res.json(response);
  } catch (error) {
    throw getErrorObject("general_error", 500, error);
  }
};
