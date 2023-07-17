const { Schema, model, isValidObjectId } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError } = require("../helpers");
const { regexps } = require("../constants");

const planSchema = new Schema(
  {
    startDate: {
      type: String,
      match: regexps.date,
      required: true,
    },
    endDate: {
      type: String,
      match: regexps.date,
      required: true,
    },
    books: [
      {
        type: Schema.Types.ObjectId,
        ref: "book",
        required: true,
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

planSchema.post("save", handleMongooseError);

const Plan = model("plan", planSchema);

const addPlanSchema = Joi.object({
  startDate: Joi.string().pattern(regexps.date).required(),
  endDate: Joi.string().pattern(regexps.date).required(),
  timezone: Joi.string().min(1).required(),
  books: Joi.array()
    .items(
      Joi.custom((value, helpers) => {
        if (!isValidObjectId(value)) {
          return helpers.message(`${value} is not valid id`);
        }
        return true;
      })
    )
    .min(1)
    .required(),
});

const schemas = {
  addPlanSchema,
};

module.exports = {
  Plan,
  schemas,
};
