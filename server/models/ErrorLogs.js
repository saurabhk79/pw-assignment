const mongoose = require("mongoose");

const ErrorLogSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
  },
  error_message: {
    type: String,
    required: true,
  },
  log_time: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.ErrorLog || mongoose.model("ErrorLog", ErrorLogSchema);
