const mongoose = require("./db").mongoose;

const bucketSchema = new mongoose.Schema({
  name: String,
}, { timestamps: true });

const Bucket = mongoose.model("Bucket", bucketSchema);

module.exports = { Bucket };
