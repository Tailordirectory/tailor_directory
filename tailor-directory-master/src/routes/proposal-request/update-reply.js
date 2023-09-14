const ProposalRequest = require('../../classes/models-controllers/ProposalRequest');
const { getErrorObject } = require('../../helpers/errors');

module.exports = async (req, res) => {
  const { id, replyId } = req.params;

  if (!req.body.message){
    throw getErrorObject('INVALID_REPLY', 400)
  }

  try {
    const object = await ProposalRequest.getById(id);
    await object.populate('businessId').execPopulate()
    await ProposalRequest.checkIsOwnerOrTailor(req.userData, object)

    const proposalRequest = await  ProposalRequest.updateReply(id, replyId, req.body.message)

    res.json(proposalRequest);
  } catch (error) {
    throw getErrorObject('general_error', 500, error);
  }
};
