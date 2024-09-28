const express = require("express");
const {
	addFeature,
	getFeatureImage,
	deleteFeatureImage,
} = require("../../controllers/common/feature-controller");

const router = express.Router();

router.post("/add", addFeature);
router.get("/get", getFeatureImage);
router.delete("/delete/:id", deleteFeatureImage);

module.exports = router;
