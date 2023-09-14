const Device = require('../../classes/models-controllers/Device');
const { getErrorObject } = require('../../helpers/errors');

module.exports = async (req, res) => {
  const { deviceId } = req.params;

  try {
    await Device.model.deleteMany({ deviceId });

    return res.json({ success: true });
  } catch (error) {
    throw getErrorObject('general_error', 500, error);
  }
};
