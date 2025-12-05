const mongoose = require("mongoose");

const EventLogSchema = new mongoose.Schema({
  eventRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true,
  },

  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true,
  },

  changes: [
    {
      fieldName: { type: String, required: true },
      oldValue: { type: mongoose.Schema.Types.Mixed },
      newValue: { type: mongoose.Schema.Types.Mixed },
    },
  ],

  updateTimestampUTC: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("EventLog", EventLogSchema);
