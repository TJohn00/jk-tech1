const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, next) => {
    const bucketId = req.params.bucketId ? `/${req.params.bucketId}` : "";
    const destinationPath = path.join("uploads/allbuckets", bucketId);

    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }

    file.fullPath = destinationPath;

    next(null, destinationPath);
  },
  filename: (req, file, next) => {
    next(null, file.originalname);
  },
});

const objectUpload = multer({ storage });

module.exports = { objectUpload };
