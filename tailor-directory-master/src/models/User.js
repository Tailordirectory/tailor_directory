const mongoose = require("mongoose");
const mongooseHidden = require("mongoose-hidden");
const uniqueValidator = require("mongoose-unique-validator");
const mongoosePaginate = require("mongoose-paginate");
const { userRoles } = require("../enums/user");
const renameId = require("../helpers/rename-id");
const { hash } = require("../helpers/password");
const validator = require("validator");
const profileTypes = require("../classes/profiles-acl");

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
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
      validate: {
        isAsync: true,
        validator: validator.isEmail,
        message: "{VALUE} is not a valid email.",
      },
    } /* 
    assignedTerms: {
      type: Boolean,
      default: false,
    }, */,
    password: {
      type: String,
      required: true,
      hideJSON: true,
      minlength: 6,
    },
    facebookId: {
      type: String,
    },
    googleId: {
      type: String,
    },
    appleId: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: Object.values(userRoles),
      default: userRoles.USER,
    },
    bannedAt: {
      type: Date,
    },
    emailVerifiedAt: {
      type: Date,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      unique: true,
      sparse: true,
    },
    companyName: {
      type: String,
    },
    phone: {
      type: phoneSchema /* 
      required: true, */,
    },
    business: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Business",
        },
      ],
    },
    profileType: {
      type: String,
      enum: profileTypes.groups,
      default: "premium_plus",
    },
  },
  {
    versionKey: false,
    _id: true,
    timestamps: true,
  }
);

schema.plugin(mongooseHidden(), { hidden: { _id: false } });
schema.plugin(mongoosePaginate);

schema.pre("save", async function hashPasswordHook() {
  if (!this.isModified("password")) return;
  this.password = await hash({ password: this.password });
});

schema.plugin(uniqueValidator, {
  message: "Error, expected {PATH} to be unique.",
});

module.exports = mongoose.model("User", schema);
