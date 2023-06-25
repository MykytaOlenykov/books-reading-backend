const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { handleMongooseError, integerValidator } = require("../helpers");

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
      validate: {
        validator: integerValidator,
        message: "Number must be integer",
      },
      min: 1000,
      max: new Date().getFullYear(),
      required: true,
    },
    pagesTotal: {
      type: Number,
      validate: {
        validator: integerValidator,
        message: "Number must be integer",
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
          message:
            "The number of pagesFinished must be less than or equal to the number of pagesTotal",
        },
        {
          validator: integerValidator,
          message: "Number must be integer",
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
    .max(new Date().getFullYear())
    .required(),
  pagesTotal: Joi.number().integer().min(1).max(5000).required(),
});

const schemas = {
  addSchema,
};

module.exports = {
  Book,
  schemas,
};
