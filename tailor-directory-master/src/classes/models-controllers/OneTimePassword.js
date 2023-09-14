const BaseController = require("./Base");
const OneTimePassword = require("../../models/OneTimePassword");
const { getErrorObject } = require("../../helpers/errors");
const { types } = require("../../enums/one-time-pass");
const Business = require("./Business");
const randomstring = require("randomstring");
const User = require("./User");

class OneTimePasswordController extends BaseController {
  /**
   * returns refreshToken model
   */
  static get model() {
    return OneTimePassword;
  }

  static get timeExpiredError() {
    return getErrorObject("time_expired", 400);
  }

  static checkIsExpired(date) {
    if (date.getTime() < Date.now()) {
      throw this.timeExpiredError;
    }
  }

  static async init(object) {
    const token = randomstring.generate({ length: 6, charset: "numeric" });

    const isAlreadyExist = await this.model.findOne(object);

    let oneTimePass;
    if (isAlreadyExist) {
      oneTimePass = await this.update(isAlreadyExist._id, {
        token,
        expiresAt: Date.now() + 600000 * 60 * 24,
      });
    } else {
      oneTimePass = await this.create(
        Object.assign(object, {
          token,
          expiresAt: Date.now() + 600000 * 60 * 24,
        })
      );
    }

    return oneTimePass;
  }

  static async verifyPhone(token, businessId) {
    const oneTimePass = await this.getOne({
      businessId,
      token,
      type: types.PHONE,
    });

    this.checkIsExpired(oneTimePass.expiresAt);

    await Business.update(oneTimePass.businessId, {
      phoneConfirmedAt: new Date(),
    });
    await this.deleteById(oneTimePass._id);
  }

  static async verifyEmail(token, businessId) {
    const oneTimePass = await this.getOne({
      businessId,
      token,
      type: types.EMAIL,
    });

    this.checkIsExpired(oneTimePass.expiresAt);

    await Business.update(oneTimePass.businessId, {
      emailVerifiedAt: new Date(),
    });
    await this.deleteById(oneTimePass._id);
  }

  static async verifyUserEmail(token, userId) {
    const oneTimePass = await this.getOne({
      userId,
      token,
      type: types.EMAIL_USER,
    });

    this.checkIsExpired(oneTimePass.expiresAt);
    console.log(oneTimePass);
    await User.update(oneTimePass.userId, {
      emailVerifiedAt: new Date(),
    });

    await this.deleteById(oneTimePass._id);
  }

  /**
   * returns notFound error, throwing when refreshToken not found by getOne or getById
   */
  static get notFoundError() {
    return getErrorObject("one_time_password_not_found", 404);
  }
}

module.exports = OneTimePasswordController;
