const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    timezone: {
      type: String,
      default: "Asia/Kolkata",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Profile", ProfileSchema);
