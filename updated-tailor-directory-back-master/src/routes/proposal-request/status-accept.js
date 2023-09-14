const ProposalRequest = require('../../classes/models-controllers/ProposalRequest');
const { getErrorObject } = require('../../helpers/errors');
const { statuses } = require('../../enums/proposal-request')

module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    const object = await ProposalRequest.getById(id)
    await object.populate('businessId').execPopulate()
    await ProposalRequest.checkIsTailor(req.userData, object)
    await ProposalRequest.checkProposalRequestStatus(object)

    const proposalRequest = await ProposalRequest.update(id, { status: statuses.ACCEPTED });
    
    res.json(proposalRequest);
  } catch (error) {
    throw getErrorObject('general_error', 500, error);
  }
};
