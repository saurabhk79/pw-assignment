const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Device = require("../models/Device");
const short_id = require("shortid");

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/pisync-app")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

function createDevices(count) {
  const statusList = ["success", "failed", "pending"];
  const result = [];
  for (let i = 0; i < count; i++) {
    let device_id = `PBX-${short_id()}`;
    let sync_status = statusList[Math.floor(Math.random() * statusList.length)];

    result.push({ device_id, sync_status });
  }

  return result;
}

async function seedDevices(devices) {
  try {
    await Device.deleteMany();
    await Device.insertMany(devices);
    console.log("Devices seeded successfully");
  } catch (err) {
    console.error("Failed to seed devices:", err);
  } finally {
    mongoose.disconnect();
  }
}
const deviceList = createDevices(20);
seedDevices(deviceList);
