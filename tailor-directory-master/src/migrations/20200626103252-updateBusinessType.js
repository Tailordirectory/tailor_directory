const ObjectId = require("mongodb").ObjectID;

module.exports = {
  async up(db, client) {
    const Types = db.collection("businesstypes");
    const Business = db.collection("businesses");
    const businesses = await Business.find({}).toArray();

    const allTypes = [
      ...new Set(businesses.map(({ businessType }) => businessType)),
    ].filter((name) => name);
    const typesObjects = {};
    console.log(
      [...new Set(businesses.map(({ businessType }) => businessType))].filter(
        (name) => name
      )
    );
    for (const type of allTypes) {
      const { insertedId } = await Types.insertOne({ name: type });
      typesObjects[type] = insertedId;
    }
    console.log(typesObjects);
    for (const business of businesses) {
      console.log(typesObjects[business.businessType]);
      await Business.updateOne(
        { _id: ObjectId(business._id) },
        {
          $set: { businessTypeId: typesObjects[business.businessType] },
        }
      );
    }
  },

  async down(db, client) {
    const Types = db.collection("businesstypes");
    const Business = db.collection("businesses");
    const businesses = await Business.find({}).toArray();

    const allTypes = await Types.find({}).toArray();

    const typesObjects = {};

    allTypes.forEach(({ _id, name }) => {
      typesObjects[_id] = name;
    });

    for (const business of businesses) {
      await Business.updateOne(
        { _id: ObjectId(business._id) },
        {
          $unset: { businessTypeId: "" },
        }
      );
    }
  },
};
