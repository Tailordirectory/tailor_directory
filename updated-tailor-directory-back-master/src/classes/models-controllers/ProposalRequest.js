const BaseController = require('./Base');
const ProposalRequest = require('../../models/ProposalRequest');
const { getErrorObject } = require('../../helpers/errors');
const { userRoles } = require('../../enums/user')
const { statuses } = require('../../enums/proposal-request')

class ProposalRequestController extends BaseController {
  /**
   * returns refreshToken model
   */
  static get model() {
    return ProposalRequest;
  }

  static get disAllowedProps(){
    return [
      '_id',
      'status',
      'tailorId',
      'userId',
      'replies'
    ]
  }

  static async addReply(id, {message, userId}){
    return super.update(id, {
      $push: {
        replies: { message, userId }
      }
    })
  }

  static async deleteReply(id, replyId){
    return super.update(id, {
      $pull: {
        replies: { $elemMatch: { _id: replyId, score: 8 } }
      }
    })
  }

  static async updateReply(id, replyId, message){
    return this.model.update({_id: id, 'replies._id': replyId}, { $set: {
      'replies.$.message': message
    }})
  }

  static checkIsOwner(userData, object) {
    if (userData._id !== object.userId && !userData.role !== userRoles.ADMIN ){
      throw getErrorObject('doesnt_have_permissions')
    }
  }

  static checkIsOwnerOrTailor(userData, object){
    if (
        userData._id !== object.userId && 
        userData._id !== object.businessId.ownerId && 
        userData.role !== userRoles.ADMIN 
      ){
      throw getErrorObject('doesnt_have_permissions')
    }
  }

  static checkIsTailor(userData, object){
    if (
      userData._id !== object.businessId.ownerId && 
      userData.role !== userRoles.ADMIN 
    ){
    throw getErrorObject('doesnt_have_permissions')
  }
  }

  static checkProposalRequestStatus(object){
    if (object.status !== statuses.PENDING){
      throw getErrorObject(`CANT_UPDATE_WITH_NOT_PENDING_STATUS`, 400)
    }
  }

  /**
   * returns notFound error, throwing when refreshToken not found by getOne or getById
   */
  static get notFoundError() {
    return getErrorObject('proposal_request_not_found', 404);
  }
}

module.exports = ProposalRequestController;
