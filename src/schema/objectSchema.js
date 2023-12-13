const mongoose = require("./db").mongoose;

const objectSchema = new mongoose.Schema({
  filename: String,
  path: String,
  bucket_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bucket",
  },
}, { timestamps: true });

const s3Object = mongoose.model("s3Object", objectSchema);

module.exports = { s3Object };
