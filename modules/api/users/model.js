const mongoose = require("mongoose");

const { Schema } = mongoose;
const bcrypt = require("bcryptjs");

const userModel = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    avatar: { type: Buffer },
    contentType: { type: String },
    friend: { type: String, default: null },
    active: { type: Boolean, default: true }
  },
  { timestamps: { createdAt: "createdAt" } }
);

userModel.pre("save", function(next) {
  if (!this.isModified("password")) {
    return next();
  }

  bcrypt
    .genSalt(12)
    .then(salt => bcrypt.hash(this.password, salt))
    .then(hash => {
      this.password = hash;
      next();
    })
    .catch(err => next(err));
});

module.exports = mongoose.model("users", userModel);
