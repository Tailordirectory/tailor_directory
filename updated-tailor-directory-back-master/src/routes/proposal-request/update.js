const ProposalRequest = require('../../classes/models-controllers/ProposalRequest');
const { getErrorObject } = require('../../helpers/errors');

module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    const object = await ProposalRequest.getById(id)
    await ProposalRequest.checkIsOwner(req.userData, object)

    ProposalRequest.deleteDisallowedProps(req.body)
    const proposalRequest = await ProposalRequest.update(id, req.body, userData);
    
    res.json(proposalRequest);
  } catch (error) {
    throw getErrorObject('general_error', 500, error);
  }
};
