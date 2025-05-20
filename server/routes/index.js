const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Device = require("../models/Device");
const ErrorLog = require("../models/ErrorLogs");
const { createToken } = require("../utils/jwt");
const authMiddleware = require("../middlewares/auth");

const router = express.Router();

router.get("/devices", authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    console.log(page, limit);
    const devices = await Device.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const total = await Device.countDocuments();

    res.json({ devices });
  } catch (error) {
    console.error("Error in /devices:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/errors", authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const logs = await ErrorLog.find()
      .sort({ log_time: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    res.json({ logs });
  } catch (error) {
    console.error("Error in /errors:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/devices/:deviceId/sync", authMiddleware, async (req, res) => {
  try {
    const { deviceId } = req.params;

    const statuses = ["Success", "Failed", "Pending"];
    const messages = {
      Success: "Device synced successfully.",
      Failed: "Sync failed due to a network error.",
      Pending: "Sync request received, awaiting processing.",
    };

    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomMessage = messages[randomStatus];

    if (randomStatus === "Failed") {
      console.error(`Sync failed for device ${deviceId}: ${randomMessage}`);
      await ErrorLog.create({
        device_id: deviceId,
        error_message: randomMessage,
        log_time: new Date(),
      });
    }

    const currentDevice = await Device.findOneAndUpdate(
      { device_id: deviceId },
      { $set: { last_sync_time: new Date(), sync_status: randomStatus } },
      { new: true }
    );

    res.json({
      message: randomMessage,
      device: currentDevice,
    });
  } catch (error) {
    console.error("Error in /devices/:deviceId/sync:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      return res.status(401).json({ message: "Invalid username or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid username or password" });

    const token = createToken({ id: user._id, username: user.username });

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error in /login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
