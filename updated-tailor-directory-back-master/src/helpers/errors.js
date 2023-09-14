const { errorsEn } = require("../enums/errors");
const config = require("../config/config");
const Raven = require("raven");

Raven.config(config.SENTRY_DSN, { captureUnhandledRejections: true }).install();

const getErrorObject = (systemKey, status, error = null) => {
  const {
    message: errorMessage = null,
    status: errStatus,
    dictionaryKey = `server_errors.${systemKey}`,
  } = error || {};
  if (error && error.stack) console.log(error.stack);
  return {
    message: errorMessage || errorsEn[systemKey] || "Something went wrong",
    dictionaryKey,
    status: errStatus || status || 500,
  };
};

module.exports = { getErrorObject };
