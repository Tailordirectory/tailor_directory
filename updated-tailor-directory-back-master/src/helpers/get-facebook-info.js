const request = require("request-promise-native").defaults({ json: true });

async function getFacebookInfo(access_token, fields = "id") {
  const res = await request("https://graph.facebook.com/v6.0/me", {
    method: "GET",
    qs: {
      access_token,
      debug: "all",
      fields: fields,
      format: "json",
      method: "get",
      pretty: 0,
      suppress_http_code: 1,
      transport: "cors",
    },
  });

  return res;
}

module.exports = getFacebookInfo;
