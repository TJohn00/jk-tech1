const express = require("express");
const app = express();

const bucketRoute = require("./src/routes/bucketRoute");

const expressListEndpoints = require("express-list-endpoints");

app.use(express.json());

app.use("/buckets", bucketRoute);

app.listen(3000, () => {
  expressListEndpoints(app).map((path) =>
    console.log(path.methods.join(",") + " - " + path.path)
  );
  console.log("\nServer is running on port 3000");
});
