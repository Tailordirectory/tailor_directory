const { errorsEn } = require('../../enums/errors')
const { getErrorObject } = require('../../helpers/errors');

module.exports = async (req, res) => {
  try {

    res.json({ server_errors: errorsEn })
  } catch (error) {
    throw getErrorObject('general_error', 500, error);
  }
};
