const ProposalRequest = require('../../classes/models-controllers/ProposalRequest');
const { getErrorObject } = require('../../helpers/errors');

module.exports = async (req, res) => {
  const { id, replyId } = req.params;


  try {
    const object = await ProposalRequest.getById(id);
    await object.populate('businessId').execPopulate()
    await ProposalRequest.checkIsOwnerOrTailor(req.userData, object)

    const proposalRequest = await  ProposalRequest.updateReply(id, replyId, {message: req.body.message})

    res.json(proposalRequest);
  } catch (error) {
    throw getErrorObject('general_error', 500, error);
  }
};
