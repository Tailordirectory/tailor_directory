const ProposalRequest = require('../../classes/models-controllers/ProposalRequest');
const { getErrorObject } = require('../../helpers/errors');

module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    const proposalRequest = await ProposalRequest.getById(id);
    await proposalRequest.populate('businessId').execPopulate()
    await ProposalRequest.checkIsOwnerOrTailor(req.userData, proposalRequest)

    res.json(proposalRequest);
  } catch (error) {
    throw getErrorObject('general_error', 500, error);
  }
};
