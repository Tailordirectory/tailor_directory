const userRoles = {
  USER: "user",
  ADMIN: "admin",
  BUSINESS: "business",
};

const filterPropsForAdmin = ["firstName", "lastName", "email", "role"];

module.exports = { userRoles, filterPropsForAdmin };
