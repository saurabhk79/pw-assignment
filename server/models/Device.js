const mongoose = require('mongoose')

const DeviceSchema = new mongoose.Schema({
  device_id: {
    type: String,
    required: true,
    unique: true,
  },
  last_sync_time: {
    type: Date,
    default: Date.now,
  },
  sync_status: {
    type: String,
    enum: ["success", "failed", "pending"],
    default: "failed",
  },
});

module.exports = mongoose.models.Device || mongoose.model("Device", DeviceSchema);
