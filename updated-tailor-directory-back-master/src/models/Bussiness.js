const mongoose = require("mongoose");
const renameId = require("../helpers/rename-id");
const mongoosePaginate = require("mongoose-paginate");
const { businessTypes, createdByTypes } = require("../enums/business");
const mediaSchema = require("./mediaSchema");
const pointSchema = require("./pointSchema");
const validator = require("validator");

const timeSchema = new mongoose.Schema(
  {
    h: {
      type: Number,
      min: 0,
      max: 23,
      default: 0,
    },
    m: {
      type: Number,
      min: 0,
      max: 59,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

const phoneSchema = new mongoose.Schema(
  {
    countryIsoCode: String,
    countryCode: String,
    phone: String,
  },
  {
    _id: false,
  }
);

const schema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    location: {
      type: pointSchema,
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    }, /* 
    phone: {
      type: String,
    }, */
    email: {
      type: String,
      trim: true,
      lowercase: true,
      validate: {
        isAsync: true,
        validator: validator.isEmail,
        message: "{VALUE} is not a valid email.",
      },
    },
    emailVerifiedAt: {
      type: Date,
      default: null,
    },
    phoneConfirmedAt: {
      type: Date,
      default: null,
    },
    workTime: {
      type: {
        start: {
          type: timeSchema,
          required: true,
        },
        end: {
          type: timeSchema,
          required: true,
        },
      },
    },
    description: {
      type: String,
    },
    rating: {
      type: Number,
      default: 0,
    },
    reviewsCount: {
      type: Number,
      default: 0,
    },
    media: {
      type: [mediaSchema],
    },
    website: {
      type: String,
    },
    phones: {
      type: [phoneSchema],
    },
    tags: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Tags",
        },
      ],
    },
    facebookProfile: {
      type: String,
    },
    instagramProfile: {
      type: String,
    },
    linkedInProfile: {
      type: String,
    },
    establishedSince: {
      type: String,
    },
    numberOfTailors: {
      type: String,
    },
    speciality: {
      type: String,
    },
    typeOfProducts: {
      type: String,
    },
    icon: {
      type: String,
    },
    contactPhone: {
      type: phoneSchema,
    },
    contactName: {
      type: String,
    },
    companyGroup: {
      type: String,
    },
    createdBy: {
      type: String,
      enum: Object.values(createdByTypes),
      default: createdByTypes.ADMIN,
    },
    businessTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BusinessTypes"
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

schema.plugin(mongoosePaginate);
schema.index({ location: "2dsphere" });

module.exports = mongoose.model("Business", schema);
