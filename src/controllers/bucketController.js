const { Bucket } = require("../schema/bucketSchema.js");
const { s3Object } = require("../schema/objectSchema.js");
const fs = require("fs");
const mongoose = require("mongoose");

const getBuckets = async (req, res) => {
  try {
    const buckets = await Bucket.find();
    res.status(200).json({ data: buckets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const createBucket = async (req, res) => {
  try {
    const bucketName = req.body.bucketName;
    if (!bucketName) {
      throw new Error("Missing bucketName");
    }

    const isValidBucketName = /^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(
      bucketName
    );

    if (!isValidBucketName) {
      throw new Error(
        "Invalid bucket name, 3 to 63 characters and lowercase hyphen only"
      );
    }

    const existingBucket = await Bucket.findOne({ name: bucketName });

    if (existingBucket) {
      throw new Error("Bucket name already exists");
    }

    const newBucket = await Bucket.create({ name: bucketName });

    res.status(201).json({
      message: "Bucket created successfully",
      bucketId: newBucket._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const deleteBucket = async (req, res) => {
  try {
    const bucketId = req.params.bucketId;
    if (!bucketId) {
      throw new Error("No bucket ID provided");
    }

    const existingBucket = await Bucket.findOne({
      _id: new mongoose.Types.ObjectId(bucketId),
    });

    if (!existingBucket) {
      throw new Error("Bucket not found");
    }

    await s3Object.deleteMany({
      bucket_id: new mongoose.Types.ObjectId(bucketId),
    });
    await Bucket.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(bucketId),
    });

    res.status(200).json({ message: "Bucket deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllObjects = async (req, res) => {
  try {
    const bucketId = req.params.bucketId;
    if (!bucketId) {
      throw Error("Missing bucketId");
    }
    const objects = await s3Object
      .find({ bucket_id: new mongoose.Types.ObjectId(bucketId) })
      .populate("bucket_id");
    res.status(200).json({ data: objects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const createObject = async (req, res) => {
  try {
    const bucketId = req.params.bucketId;

    if (!req.file) {
      throw Error("No object found");
    }

    const existingBucket = await Bucket.findOne({
      _id: new mongoose.Types.ObjectId(bucketId),
    });

    if (!existingBucket) {
      throw new Error("Bucket not found");
    }

    const existingObject = await s3Object.findOne({
      filename: req.file.originalname,
      bucket_id: new mongoose.Types.ObjectId(bucketId),
    });

    if (existingObject) {
      existingObject.path = req.file.path;
      await existingObject.save();
      res.status(200).json({
        message: "File replaced successfully",
        fileId: existingObject._id,
      });
    } else {
      const newObject = await s3Object.create({
        filename: req.file.originalname,
        path: req.file.path,
        bucket_id: new mongoose.Types.ObjectId(bucketId),
      });
      res
        .status(201)
        .json({ message: "File uploaded successfully", fileId: newObject._id });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const getOneObject = async (req, res) => {
  const { bucketId, objId } = req.params;
  try {
    const s3Obj = await s3Object.findOne({
      _id: new mongoose.Types.ObjectId(objId),
      bucket_id: new mongoose.Types.ObjectId(bucketId),
    });
    if (!s3Obj) {
      throw Error("No object found");
    }
    res.status(200).download(s3Obj.path);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const deleteOneObject = async (req, res) => {
  const { bucketId, objId } = req.params;
  try {
    const deletedFile = await s3Object.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(objId),
      bucket_id: new mongoose.Types.ObjectId(bucketId),
    });

    if (!deletedFile) {
      throw Error("No object deleted");
    }

    const filePath = deletedFile.path;
    fs.unlinkSync(filePath);

    const folderPath = path.dirname(filePath);
    if (fs.existsSync(folderPath)) {
      fs.rmdirSync(folderPath);
    }

    res.status(200).json({ message: "File and folder deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getBuckets,
  createBucket,
  getAllObjects,
  createObject,
  getOneObject,
  deleteOneObject,
  deleteBucket,
};
