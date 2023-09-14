const OneTimePassword = require('../../classes/models-controllers/OneTimePassword');
const { getErrorObject } = require('../../helpers/errors');
const { types } = require('../../enums/one-time-pass');

module.exports = async (req, res) => {
  const { id } = req.params
  
  try {
    const oneTimePass = await OneTimePassword.init({
      businessId: id,
      type: types.PHONE
    }) 

    res.json(oneTimePass);
  } catch (error) {
    throw getErrorObject('GENERAL_ERROR', 400, error);
  }
};
