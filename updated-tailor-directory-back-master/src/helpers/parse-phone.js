const phoneParser = require("libphonenumber-js");

module.exports = (phone) => {
  const parsedPhone = phoneParser.parsePhoneNumberFromString(phone);
  return parsedPhone
    ? {
        countryIsoCode: parsedPhone.country
          ? parsedPhone.country.toLocaleLowerCase()
          : parsedPhone.country,
        countryCode: `+${parsedPhone.countryCallingCode}`,
        phone: parsedPhone.nationalNumber,
      }
    : null;
};
