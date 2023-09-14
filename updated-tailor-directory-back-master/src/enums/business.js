const businessTypes = {
  TAILOR: "tailor",
  LAUNDRY: "laundry",
};

const createdByTypes = {
  ADMIN: "admin",
  CLAIM: "claim",
  OWNER: "owner",
};

const filteredProps = [
  "businessName",
  "ownerId.firstName",
  "ownerId.lastName",
  "createdBy",
  "country",
  "zipCode",
  "businessTypeId.name",
];

module.exports = { businessTypes, createdByTypes, filteredProps };
