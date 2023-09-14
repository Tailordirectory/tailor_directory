const OneTimePassword = require('../../classes/models-controllers/OneTimePassword');
const { getErrorObject } = require('../../helpers/errors');
const Token = require('../../classes/Token')

module.exports = async (req, res) => {
  const { id } = req.params
  
  const { token, businessId } = Token.decode(id)

  try {
    await OneTimePassword.verifyEmail(token, businessId) 

    res.json({success:true});
  } catch (error) {
    throw getErrorObject('GENERAL_ERROR', 400, error);
  }
};
