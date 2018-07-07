const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PENDING = 0;
const ACCEPTED = 1;
const REJECTED = 2;

let requestStatus = {PENDING, ACCEPTED, REJECTED};

const friendModel = new Schema(
  {
    sender: String,
    receiver: String,
    status: Number,
  },
  { timestamps: { createdAt: "createdAt" } }
);

module.exports = {
  friendModel: mongoose.model("Friend", friendModel),
  requestStatus
};