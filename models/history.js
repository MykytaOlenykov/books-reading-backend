const { Schema, model } = require("mongoose");

const { handleMongooseError } = require("../helpers");
const { regexps } = require("../constants");

const historySchema = new Schema(
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
    completionDate: {
      type: String,
      match: regexps.date,
      required: true,
    },
    status: {
      type: String,
      enum: ["cancel", "finished", "timeover"],
      required: true,
    },
    stats: {
      type: [Schema.Types.ObjectId],
      ref: "stat",
      default: [],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      unique: true,
      required: true,
    },
  },
  { versionKey: false, timestamps: true }
);

historySchema.post("save", handleMongooseError);

const History = model("history", historySchema);

module.exports = {
  History,
};
