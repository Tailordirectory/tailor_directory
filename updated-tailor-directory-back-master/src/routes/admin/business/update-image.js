const { getErrorObject } = require('../../../helpers/errors');
const Business = require('../../../classes/models-controllers/Business');
const { upload: s3Upload } = require('../../../helpers/s3-upload');

module.exports = async (req, res) => {
  if (!req.files) throw getErrorObject('invalid_request', 400);
  const { id } = req.params;

  try {
    const business = await Business.getById(id);

    const promises = req.files
      .map(async (file) => {
        const Key = `media/${Date.now()}/${file.originalname.split(' ').join('_')}`;
        const objectLocation = await s3Upload(Key, file);

        return { url: objectLocation, type: file.mimetype };
      });

    const mediaArr = await Promise.all(promises);

    business.media = business.media.concat(mediaArr);
    await business.save();

    res.send({ success: true, doc: business.media });
  } catch (error) {
    throw getErrorObject('general_error', 500, error);
  }
};
