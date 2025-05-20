const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const User = require("../models/User");

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/pisync-app")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

async function main(username, password) {
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hash });
    await user.save();
    console.log("User created successfully");
  } catch (err) {
    console.error("Failed to create user:", err);
  } finally {
    mongoose.disconnect();
  }
}

main("User", "user@123");
