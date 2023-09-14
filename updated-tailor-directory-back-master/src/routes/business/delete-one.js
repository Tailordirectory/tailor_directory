const Business = require('../../classes/models-controllers/Business');
const { getErrorObject } = require('../../helpers/errors');

module.exports = async (req, res) => {
  const { id } = req.params;

  try {
    const object = await Business.getById(id)
    await Business.checkIsOwner(req.userData, object)

    const business = await Business.deleteById(id);
    
    res.json(business);
  } catch (error) {
    throw getErrorObject('general_error', 500, error);
  }
};
