const BaseController = require("./Base");
const RefreshToken = require("../../models/RefreshToken");
const { getErrorObject } = require("../../helpers/errors");
const Token = require("../Token");

class RefreshTokenController extends BaseController {
  /**
   * returns refreshToken model
   */
  static get model() {
    return RefreshToken;
  }

  /**
   * returns notFound error, throwing when refreshToken not found by getOne or getById
   */
  static get notFoundError() {
    return getErrorObject("refresh_token_not_found", 404);
  }

  static get expiredError() {
    return getErrorObject("refresh_token_expired", 401);
  }

  /**
   * rewrited basic create method
   * @param {{userId:string, token:string}} param0
   */
  static create({ userId, token }) {
    const refreshToken = Token.createRefreshToken(userId);

    return super.create({ userId, token, refreshToken });
  }

  static async getOne(object) {
    const refreshToken = await super.getOne(object);

    try {
      Token.verify({ token: object.refreshToken });
    } catch (err) {
      await this.deleteById(refreshToken._id);
      throw this.expiredError;
    }

    return refreshToken;
  }
}

module.exports = RefreshTokenController;
