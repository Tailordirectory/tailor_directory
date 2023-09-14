const BaseController = require("./Base");
const BusinessTypes = require("../../models/BusinessTypes");
const { getErrorObject } = require("../../helpers/errors");

class BusinessTypesController extends BaseController {
  /**
   * returns refreshToken model
   */
  static get model() {
    return BusinessTypes;
  }

  /**
   * returns notFound error, throwing when refreshToken not found by getOne or getById
   */
  static get notFoundError() {
    return getErrorObject("business_type_not_found", 404);
  }
}

module.exports = BusinessTypesController;
