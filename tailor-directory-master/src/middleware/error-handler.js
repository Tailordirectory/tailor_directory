const config = require('../config/config');

// error handler
module.exports = (error, req, res, next) => {
  // set locals, only providing error in development
  
  const {
    message = 'Something went wrong',
    dictionaryKey = 'server_errors.general_error',
    status = 500
  } = error || {}

  const err = {
    message,
    dictionaryKey,
    status
  }
  
  res.locals.message = err.message;
  res.locals.error = config.NODE_ENV === 'development' ? err : {};

  if (config.NODE_ENV !== 'development'){
    delete err.message
  }

  // render the error page
  res.status(err.status || 500);
  res.json(err);
};
