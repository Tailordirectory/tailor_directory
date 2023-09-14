const AWS = require('aws-sdk');
const config = require('../config/config');
const { getErrorObject } = require('../helpers/errors');

AWS.config.update({
  accessKeyId: config.S3_ACCESS_KEY,
  secretAccessKey: config.S3_SECRET_KEY,
  region: config.S3_REGION,
  signatureVersion: 'v4',
});

const s3 = new AWS.S3();

const upload = async (fileName, file) => {
  const params = {
    Bucket: config.S3_BUCKET_NAME,
    fileName,
    ACL: 'public-read',
    ContentType: file.mimetype,
    Body: file.buffer,
  };

  try {
    const object = await s3.upload(params).promise();

    return object.Location;
  } catch (error) {
    throw getErrorObject('general_error', 500, error);
  }
};

module.exports = {
  upload,
};
