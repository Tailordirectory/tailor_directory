const ProposalRequest = require('../../classes/models-controllers/ProposalRequest');
const { getErrorObject } = require('../../helpers/errors');

module.exports = async (req, res) => {
  const userId = req.user.userId
  const limit = Number(req.query.limit || 10)
  const offset = Number(req.query.offset || 0)

  try {
    const proposalRequest = await ProposalRequest.paginate({ $or: [{ userId }, { businessId: { $in: req.userData.business } } ] }, offset, limit);
    
    res.json(proposalRequest);
  } catch (error) {
    throw getErrorObject('general_error', 500, error);
  }
};
