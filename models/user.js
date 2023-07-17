const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");
const { regexps } = require("../constants");

const userSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 255,
      match: regexps.name,
      required: true,
    },
    email: {
      type: String,
      minlength: 4,
      maxlength: 255,
      match: regexps.email,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    accessToken: {
      type: String,
      default: "",
    },
    refreshToken: {
      type: String,
      default: "",
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(255).pattern(regexps.name).required(),
  email: Joi.string().min(4).max(255).pattern(regexps.email).required(),
  password: Joi.string().min(8).max(255).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().min(4).max(255).pattern(regexps.email).required(),
  password: Joi.string().min(8).max(255).required(),
});

const User = model("user", userSchema);

const schemas = {
  registerSchema,
  loginSchema,
};

module.exports = {
  User,
  schemas,
};
