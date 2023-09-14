const ProposalRequest = require('../../classes/models-controllers/ProposalRequest');
const { getErrorObject } = require('../../helpers/errors');

module.exports = async (req, res) => {
  const { body } = req;
  const userId = req.user.userId

  try {
    const result = await ProposalRequest.create(Object.assign(body, {
      userId
    }))

    res.json(result)
  } catch (error) {
    throw getErrorObject('general_error', 500, error);
  }
};
