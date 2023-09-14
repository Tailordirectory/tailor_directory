const User = require("../../models/User");
const BaseController = require("./Base");
const { getErrorObject } = require("../../helpers/errors");

class UserController extends BaseController {
  /**
   * returns user's Model
   */
  static get model() {
    return User;
  }

  /**
   * returns notFound error, throwing when user not found by getOne or getById
   */
  static get notFoundError() {
    return getErrorObject("user_not_found", 404);
  }
  /**
   * returns props for basic method deleteDissalowedProps
   * @returns {String[]}
   */
  static get disAllowedProps() {
    return [
      "_id",
      "role",
      "createdAt",
      "updatedAt",
      "bannedAt",
      "assignedTerms",
      "facebookId",
      "googleId",
      "appleId",
      "emailVerifiedAt",
      "profileType"
    ];
  }

  static get tailorRequiredProps() {
    return [
      "email",
      "password",
      "address",
      "city",
      "country",
      "location",
      "businessName",
      "businessTypeId",
      "zipCode",
      "contactPhone"
    ];
  }

  static checkIsValidTailor(object) {
    for (const prop of this.tailorRequiredProps) {
      if (!object[prop]) {
        throw getErrorObject("invalid_tailor_object", 400, {
          message: `${prop} not defined`,
        });
      }
    }
  }

  /**
   *
   * @param {string} id
   * @returns {Promise} banned user
   */
  static async ban(id) {
    const user = await this.getById(id);

    if (user.bannedAt) throw getErrorObject("user_already_banned", 400);

    user.bannedAt = new Date();

    await user.save();

    return user;
  }

  /**
   * @param {string} id
   * @returns {Promise} unbanned user
   */
  static async unban(id) {
    const user = await this.getById(id);
    if (!user.bannedAt) throw getErrorObject("user_already_unbanned", 400);

    user.bannedAt = undefined;

    await user.save();

    return user;
  }
}

module.exports = UserController;
