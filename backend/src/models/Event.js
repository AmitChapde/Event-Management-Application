const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    startTimeUTC: {
      type: Date,
      required: true,
    },
    endTimeUTC: {
      type: Date,
      required: true,
    },
    initialTimezone: {
      type: String,
      required: true,
    },
    assignedProfiles: [
      {
        type: Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Event", EventSchema);
