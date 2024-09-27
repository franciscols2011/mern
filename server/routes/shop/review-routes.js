// routes/shop/review-routes.js
const express = require("express");
const {
	addProductReview,
	getProductReviews,
	deleteProductReview,
} = require("../../controllers/shop/product-review-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controllers");

const router = express.Router();

router.post("/add", authMiddleware, addProductReview);
router.get("/:productId", getProductReviews);
router.delete("/:reviewId", authMiddleware, deleteProductReview);

module.exports = router;
