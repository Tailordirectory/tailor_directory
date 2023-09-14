const Bussiness = require("../../models/Bussiness");
const Users = require("../../models/User");
const BussinessType = require("../../models/BusinessTypes");
const BaseController = require("./Base");
const { getErrorObject } = require("../../helpers/errors");
const { userRoles } = require("../../enums/user");
const ProfilesAcl = require("../profiles-acl");

class BussinessController extends BaseController {
  /**
   * returns user's Model
   */
  static get model() {
    return Bussiness;
  }

  static get selectFields() {
    return {
      _id: 1,
      role: 1,
      profileType: 1,
      firstName: 1,
      lastName: 1,
    };
  }

  static filter(a, b) {
    if (a.ownerId && b.ownerId) {
      return (
        ProfilesAcl.getProfileTypeScore(a.ownerId.profileType) -
        ProfilesAcl.getProfileTypeScore(b.ownerId.profileType)
      );
    } else if (a.ownerId) {
      return 1;
    } else if (b.ownerId) {
      return -1;
    } else {
      return 0;
    }
  }

  /**
   * returns notFound error, throwing when user not found by getOne or getById
   */
  static get notFoundError() {
    return getErrorObject("business_not_found", 404);
  }

  static checkIsOwner(userData, object) {
    if (
      userData._id.toString() !== object.ownerId.toString() &&
      userData.role !== userRoles.ADMIN
    ) {
      if (
        object.ownerId &&
        object.ownerId._id &&
        userData._id.toString() === object.ownerId._id.toString()
      ) {
        return true;
      }
      throw getErrorObject("doesnt_have_permissions");
    }
  }

  /**
   * returns props for basic method deleteDissalowedProps
   * @returns {String[]}
   */
  static get disAllowedProps() {
    return [
      "_id",
      "ownerId",
      "rating",
      "reviewsCount",
      "emailVerifiedAt",
      "createdBy",
    ];
  }

  static async create(object) {
    const business = await super.create(object);

    if (business.ownerId) {
      await Users.update(
        { _id: business.ownerId },
        { $push: { business: business._id } }
      );
    }

    return business;
  }

  static async updateForAdmin(id, object) {
    const oldBusiness = await super.getById(id);
    const business = await super.update(id, object);

    if (oldBusiness.ownerId !== business.ownerId) {
      if (business.ownerId) {
        await Users.update(
          { _id: business.ownerId },
          { $push: { business: business._id } }
        );
        await Users.update(
          { _id: oldBusiness.ownerId },
          { $pull: { business: business._id } }
        );
      } else {
        await Users.update(
          { _id: oldBusiness.ownerId },
          { $pull: { business: business._id } }
        );
      }
    }

    return business;
  }

  static async deleteById(id) {
    const business = super.deleteById(id);

    await Users.update(
      { _id: business.ownerId },
      { $pull: { business: business._id } }
    );

    return business;
  }

  static async getTotalCount(aggregateOptions) {
    aggregateOptions.push({ $count: "count" });
    const count = await this.model.aggregate(aggregateOptions);
    return count.length && count[0].count ? count[0].count : 0;
  }

  static async findByLocation({
    filter,
    x,
    y,
    maxDistance,
    skip = 0,
    limit = 100,
    geoSearch = false,
    sort = {},
    orFilter = {},
    isAdmin = false
  }) {
    const aggregateOptions = [];

    const geoOptions = {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [x, y],
        },
        maxDistance: maxDistance * 1000,
        spherical: true,
        distanceMultiplier: 0.001,
        distanceField: "distance",
        key: "location",
      },
    };

    const PopulateUser = [
      {
        $lookup: {
          from: Users.collection.collectionName,
          let: { ownerId: "$ownerId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$ownerId"] } } },
            { $project: this.selectFields },
          ],
          as: "ownerId",
        },
      },
      {
        $unwind: {
          path: "$ownerId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: BussinessType.collection.collectionName,
          let: { businessTypeId: "$businessTypeId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$businessTypeId"] } } },
          ],
          as: "businessTypeId",
        },
      },
      {
        $unwind: {
          path: "$businessTypeId",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    const addFields = {
      $addFields: {
        ownerId: {
          $cond: {
            if: { $isArray: "$ownerId" },
            then: null,
            else: "$ownerId",
          },
        },
        profileTypeScore: {
          $or: [],
        },
      },
    };

    for (const [profileType, permission] of Object.entries(
      ProfilesAcl.config.accounts
    )) {
      if (permission.is_on_top)
        addFields.$addFields.profileTypeScore.$or.push({
          $eq: ["$ownerId.profileType", profileType],
        });
    }

    if (x && y && maxDistance && geoSearch) {
      aggregateOptions.push(geoOptions);
    }

    aggregateOptions.push({ $project: { password: 0 } });
    aggregateOptions.push(...PopulateUser, addFields);

    if (Object.keys(filter).length) {
      aggregateOptions.push({ $match: filter });
    }

    if (Object.keys(orFilter).length) {
      aggregateOptions.push({ $match: orFilter });
    }

    if (Object.keys(sort).length && isAdmin) {
      aggregateOptions.push({ $sort: sort });
    } else aggregateOptions.push({ $sort: { profileTypeScore: -1, distance: 1 } });

    const docs = await this.model
      .aggregate(aggregateOptions)
      .skip(skip)
      .limit(limit);    

    await this.model.populate(docs, { path: "tags" });

    const total = await this.getTotalCount(aggregateOptions);

    return { docs, total, offset: skip, limit };
  }

  static async findByLocationForXls({
    filter,
    x,
    y,
    maxDistance,
    skip = 0,
    limit = 100,
    geoSearch = false,
  }) {
    const aggregateOptions = [];

    const geoOptions = {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [x, y],
        },
        maxDistance: maxDistance * 1000,
        spherical: true,
        distanceMultiplier: 0.001,
        distanceField: "distance",
        key: "location",
      },
    };

    if (x && y && maxDistance && geoSearch) {
      aggregateOptions.push(geoOptions);
      aggregateOptions.push({ $match: filter });
    } else if (Object.keys(filter).length) {
      aggregateOptions.push({ $match: filter });
    }

    aggregateOptions.push({ $project: { password: 0 } });

    const docs = await this.model
      .aggregate(aggregateOptions)
      .sort({ distance: 1 })
      .skip(skip)
      .limit(limit);
    const total = await this.getTotalCount(aggregateOptions);
    console.log(aggregateOptions);
    return { docs, total, offset: skip, limit };
  }
}

module.exports = BussinessController;
