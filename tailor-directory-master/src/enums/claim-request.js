const statuses = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  DECLINED: "declined",
};

const filteredProps = [
  "businessId.businessName",
  "businessId.country",
  "businessId.city",
  "businessId.address",
  "businessId.zipCode",
  "userId.firstName",
  "userId.lastName",
  "status",
];

const userSelect = {
  firstName: 1,
  lastName: 1,
  username: 1,
  role: 1,
  profileType: 1,
  _id: 1,
};

const businessSelect = {
  businessName: 1,
  country: 1,
  city: 1,
  address: 1,
  _id: 1,
};

module.exports = {
  statuses,
  filteredProps,
  userSelect,
  businessSelect,
};
