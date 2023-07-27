const { Schema, model, isValidObjectId } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");
const { regexps } = require("../constants");

const currentDateStatsSchema = new Schema({
  pagesRead: {
    type: Number,
    required: true,
  },
  time: {
    type: String,
    match: regexps.time,
    required: true,
  },
  book: {
    type: Schema.Types.ObjectId,
    ref: "book",
    required: true,
  },
  isFinishedBook: {
    type: Boolean,
    default: false,
  },
});

const statSchema = new Schema(
  {
    date: {
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

statSchema.post("save", handleMongooseError);

const Stat = model("stat", statSchema);

const addStatsSchema = Joi.object({
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
