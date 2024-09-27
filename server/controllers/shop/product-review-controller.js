const Order = require("../../models/Order");
const Product = require("../../models/Product");
const ProductReview = require("../../models/Review");

const addProductReview = async (req, res) => {
	try {
		const { productId, userId, userName, reviewMessage, reviewValue } =
			req.body;

		const order = await Order.findOne({
			userId,
			"cartItems.productId": productId,
			orderStatus: "confirmed",
		});

		if (!order) {
			return res.status(404).json({
				success: false,
				message: "You need to purchase the product first",
			});
		}

		const checkExistingReview = await ProductReview.findOne({
			productId,
			userId,
		});

		if (checkExistingReview) {
			return res.status(400).json({
				success: false,
				message: "You already reviewed this product",
			});
		}

		const newReview = new ProductReview({
			productId,
			userId,
			userName,
			reviewMessage,
			reviewValue,
		});

		await newReview.save();

		const reviews = await ProductReview.find({ productId });

		const totalReviewsLength = reviews.length;

		const averageReview =
			reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
			totalReviewsLength;

		await Product.findByIdAndUpdate(productId, {
			averageReview,
		});

		res.status(201).json({
			success: true,
			data: reviews,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Some error occurred",
		});
	}
};

const getProductReviews = async (req, res) => {
	try {
		const { productId } = req.params;
		const reviews = await ProductReview.find({ productId });
		res.status(200).json({
			success: true,
			data: reviews,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Some error occurred",
		});
	}
};

const deleteProductReview = async (req, res) => {
	try {
		const { reviewId } = req.params;
		const review = await ProductReview.findById(reviewId);

		if (!review) {
			return res.status(404).json({
				success: false,
				message: "Review not found",
			});
		}

		if (review.userId.toString() !== req.user.id) {
			return res.status(403).json({
				success: false,
				message: "Unauthorized to delete this review",
			});
		}

		await ProductReview.findByIdAndDelete(reviewId);

		const reviews = await ProductReview.find({ productId: review.productId });

		const totalReviewsLength = reviews.length;

		const averageReview =
			totalReviewsLength === 0
				? 0
				: reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
				  totalReviewsLength;

		await Product.findByIdAndUpdate(review.productId, {
			averageReview,
		});

		res.status(200).json({
			success: true,
			data: reviews,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Some error occurred",
		});
	}
};

module.exports = { addProductReview, getProductReviews, deleteProductReview };
