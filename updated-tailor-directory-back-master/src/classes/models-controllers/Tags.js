const BaseController = require('./Base');
const Tags = require('../../models/Tags');
const { getErrorObject } = require('../../helpers/errors');

class TagsController extends BaseController {
  /**
   * returns refreshToken model
   */
  static get model() {
    return Tags;
  }

  /**
   * returns notFound error, throwing when refreshToken not found by getOne or getById
   */
  static get notFoundError() {
    return getErrorObject('tag_not_found', 404);
  }
}

module.exports = TagsController;
