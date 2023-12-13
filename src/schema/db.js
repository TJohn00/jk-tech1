const mongoose = require("mongoose");
const mongoCred = require("../config/config");

const database = mongoCred.creds.database;
const ip = mongoCred.creds.host;
const username = mongoCred.creds.username;
const password = mongoCred.creds.password;

mongoose.connect(`mongodb://${username}:${password}@${ip}/${database}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error"));

db.once("open", () => {
  console.log("Connected to MongoDB");
});

module.exports = { mongoose, db };
