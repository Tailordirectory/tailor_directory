const BaseController = require("./Base");
const ClaimRequest = require("../../models/ClaimRequest");
const { getErrorObject } = require("../../helpers/errors");
const { statuses } = require("../../enums/claim-request");
const { createdByTypes } = require("../../enums/business");
const Business = require("./Business");

class ClaimRequestController extends BaseController {
  /**
   * returns refreshToken model
   */
  static get model() {
    return ClaimRequest;
  }

  static get disAllowedProps() {
    return ["_id", "status", "userId"];
  }
  /**
   * returns notFound error, throwing when refreshToken not found by getOne or getById
   */
  static get notFoundError() {
    return getErrorObject("claim_request_not_found", 404);
  }

  static checkIsOwner(userData, object) {
    if (
      object.userId &&
      userData._id.toString() === object.userId._id.toString()
    ) {
      return true;
    }
    throw getErrorObject("doesnt_have_permissions");
  }

  static async accept(id) {
    const claim = await this.getById(id);
    await claim.populate("userId").populate("businessId").execPopulate();

    if (claim.businessId.ownerId) {
      throw getErrorObject("business_already_have_owner");
    }

    if (claim.status === statuses.ACCEPTED) {
      throw getErrorObject("claim_already_accepted");
    }

    await Business.updateForAdmin(claim.businessId._id, {
      ownerId: claim.userId._id,
      createdBy: createdByTypes.CLAIM,
      createdAt: new Date(),
    });

    return this.update(id, {
      status: statuses.ACCEPTED,
    });
  }

  static async decline(id) {
    const claim = await this.getById(id);

    if (claim.status === statuses.ACCEPTED) {
      await Business.updateForAdmin(claim.businessId, {
        ownerId: null,
        createdBy: createdByTypes.ADMIN,
      });
    } else if (claim.status === statuses.DECLINED) {
      throw getErrorObject("claim_already_declined");
    }

    return this.update(id, {
      status: statuses.DECLINED,
    });
  }
}

module.exports = ClaimRequestController;
