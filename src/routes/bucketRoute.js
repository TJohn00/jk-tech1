const express = require("express");
const router = express.Router();
const { objectUpload } = require("../middleware/multerConfig");

const controllerObj = require("../controllers/bucketController");

router.get("/", controllerObj.getBuckets);
router.post("/", controllerObj.createBucket);
router.delete("/:bucketId", controllerObj.deleteBucket);
router.post(
  "/:bucketId/objects",
  objectUpload.single("object"),
  controllerObj.createObject
);
router.get("/:bucketId", controllerObj.getAllObjects);
router.get("/:bucketId/objects/:objId", controllerObj.getOneObject);
router.delete("/:bucketId/objects/:objId", controllerObj.deleteOneObject);

module.exports = router;
