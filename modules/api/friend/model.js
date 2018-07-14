const mongoose = require("mongoose");

const { Schema } = mongoose;

const PENDING = 0;
const ACCEPTED = 1;
const REJECTED = 2;

const requestStatus = { PENDING, ACCEPTED, REJECTED };

const friendModel = new Schema(
  {
    sender: { type: String },
    receiver: { type: String },
    status: { type: Number, default: PENDING },
    active: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "createdAt" } }
);

module.exports = {
  friendModel: mongoose.model("Friend", friendModel),
  requestStatus
};
