const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { ServerConfig } = require("../config");
const AppError = require("../utils/errors/app-error");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      max: 20,
      min: 3,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      min: 6,
      max: 20,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      min: 6,
      max: 20,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const encryptedPassword = bcrypt.hashSync(
      this.password,
      +ServerConfig.SALT_ROUNDS
    );

    this.password = encryptedPassword;
    return next();
  } catch (error) {
    throw new AppError(
      "Cannot Create a new City Object!",
      { explanation: error.message },
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
});

const User = mongoose.model("User", userSchema);
module.exports = User;
