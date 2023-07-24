const { Schema, model, isValidObjectId } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");
const { regexps } = require("../constants");

const currentDateStatsSchema = new Schema({
  pagesRead: {
    type: Number,
    required: true,
  },
  timeOfCreation: {
    type: String,
    match: regexps.time,
    required: true,
  },
});

const statSchema = new Schema(
  {
    dateOfCreation: {
      type: String,
      match: regexps.date,
      required: true,
    },
    pagesPerDay: {
      type: Number,
      required: true,
    },
    currentDateStats: {
      type: [currentDateStatsSchema],
      validate: {
        validator: function (stats) {
          return stats && stats.length > 0;
        },
        message: "The 'currentDateStats' array must contain at least one stat.",
      },
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

statSchema.index({ owner: 1, dateOfCreation: 1 }, { unique: true });

statSchema.post("save", handleMongooseError);

const Stat = model("stat", statSchema);

const addStatsSchema = Joi.object({
  dateOfCreation: Joi.string().pattern(regexps.date).required(),
  timeOfCreation: Joi.string().pattern(regexps.time).required(),
  pagesRead: Joi.number().required(),
  book: Joi.string()
    .custom((value, helpers) => {
      if (!isValidObjectId(value)) {
        return helpers.message(`${value} is not valid id`);
      }
      return value;
    })
    .required(),
});

const schemas = {
  addStatsSchema,
};

module.exports = {
  Stat,
  schemas,
};
