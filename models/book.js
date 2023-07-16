const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError, integerValidator } = require("../helpers");
const { regexps, customSchemaMessages } = require("../constants");

const bookSchema = new Schema(
  {
    title: {
      type: String,
      minlength: 2,
      maxlength: 255,
      required: true,
    },
    author: {
      type: String,
      minlength: 2,
      maxlength: 255,
      required: true,
    },
    publishYear: {
      type: Number,
      validate: [
        {
          validator: integerValidator,
          message: customSchemaMessages.integer,
        },
        {
          validator(value) {
            return regexps.publishYear.test(String(value));
          },
          message: customSchemaMessages.publishYearMatch,
        },
      ],
      required: true,
    },
    pagesTotal: {
      type: Number,
      validate: {
        validator: integerValidator,
        message: customSchemaMessages.integer,
      },
      min: 1,
      max: 5000,
      required: true,
    },
    pagesFinished: {
      type: Number,
      validate: [
        {
          validator(value) {
            return value <= this.pagesTotal;
          },
          message: customSchemaMessages.pagesFinishedMatch,
        },
        {
          validator: integerValidator,
          message: customSchemaMessages.integer,
        },
      ],
      min: 0,
      default: 0,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

bookSchema.post("save", handleMongooseError);

const Book = model("book", bookSchema);

const addSchema = Joi.object({
  title: Joi.string().min(2).max(255).required(),
  author: Joi.string().min(2).max(255).required(),
  publishYear: Joi.number()
    .integer()
    .min(1000)
    .custom((value, helpers) => {
      if (!regexps.publishYear.test(String(value))) {
        return helpers.message(customSchemaMessages.publishYearMatch);
      }
      return true;
    })
    .options({ convert: false })
    .required(),
  pagesTotal: Joi.number()
    .integer()
    .min(1)
    .max(5000)
    .options({ convert: false })
    .required(),
});

const schemas = {
  addSchema,
};

module.exports = {
  Book,
  schemas,
};
