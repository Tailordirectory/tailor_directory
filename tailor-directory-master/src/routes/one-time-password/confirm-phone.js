const OneTimePassword = require('../../classes/models-controllers/OneTimePassword');
const { getErrorObject } = require('../../helpers/errors');

module.exports = async (req, res) => {
  const { id } = req.params
  const { token } = req.body;
  
  try {
    await OneTimePassword.verifyPhone(token, id) 

    res.json({success:true});
  } catch (error) {
    throw getErrorObject('GENERAL_ERROR', 400, error);
  }
};
