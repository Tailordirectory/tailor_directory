module.exports = function fromHeaderOrQuerystring(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  } else if (
    req.query.Authorization &&
    req.query.Authorization.split(" ")[0] === "Bearer"
  ) {
    return req.query.Authorization.split(" ")[1];
  }
  return null;
};
