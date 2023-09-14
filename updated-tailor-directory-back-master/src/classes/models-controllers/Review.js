const BaseController = require("./Base");
const Review = require("../../models/Reviews");
const { getErrorObject } = require("../../helpers/errors");
const { userRoles } = require("../../enums/user");
const Business = require("../../models/Bussiness");

class ReviewController extends BaseController {
  /**
   * returns refreshToken model
   */
  static get model() {
    return Review;
  }

  static get disAllowedProps() {
    return ["_id", "userId", "businessId"];
  }

  static get alreadyExistsError() {
    return getErrorObject("review_already_exist");
  }

  static checkIsOwner(userData, object) {
    if (
      userData._id.toString() !== object.userId.toString() &&
      !userData.role !== userRoles.ADMIN
    ) {
      throw getErrorObject("doesnt_have_permissions");
    }
  }

  static async checkAlreadyExists(businessId, userId) {
    const review = await this.model.findOne({ businessId, userId });

    if (review) {
      throw this.alreadyExistsError;
    }
  }

  static async updateBusinessOnDelete(businessId, rating) {
    return this.updateBusiness(businessId, Number(rating) * -1, -1, 0);
  }

  static async updateBusiness(businessId, rating, count = 1, decrement = 1) {
    const business = await Business.findOne({ _id: businessId });
    console.log(business);
    business.reviewsCount = Number(business.reviewsCount) + count;
    business.rating = business.reviewsCount
      ? (Number(business.rating) * (Number(business.reviewsCount) - decrement) +
          rating) /
        (Number(business.reviewsCount) || 1)
      : 0;

    await business.save();
  }

  static async create(object) {
    const { userId, businessId, stars } = object;
    await this.checkAlreadyExists(businessId, userId);

    const review = await super.create(object);
    await this.updateBusiness(businessId, stars);

    return review;
  }

  static async deleteById(id) {
    const object = await super.deleteById(id);

    await this.updateBusinessOnDelete(object.businessId, object.stars);

    return object;
  }

  static async getAllPaginate(filter, limit, offset, sort = {}) {
    return this.paginate(filter, limit, offset, sort);
  }
}

module.exports = ReviewController;
