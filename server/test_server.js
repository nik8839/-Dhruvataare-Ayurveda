console.log("Starting test");
try {
  const dotenv = require("dotenv");
  console.log("dotenv loaded");
  dotenv.config();
  console.log("env loaded", process.env.PORT);
} catch (e) { console.error("dotenv error", e); }

try {
  const express = require("express");
  console.log("express loaded");
} catch (e) { console.error("express error", e); }

try {
  const mongoose = require("mongoose");
  console.log("mongoose loaded");
} catch (e) { console.error("mongoose error", e); }

try {
  const redis = require("redis");
  console.log("redis loaded");
} catch (e) { console.error("redis error", e); }

try {
  const connectDB = require("./config/database");
  console.log("db config loaded");
} catch (e) { console.error("db config error", e); }

try {
  const { connectRedis } = require("./config/redis");
  console.log("redis config loaded");
} catch (e) { console.error("redis config error", e); }
