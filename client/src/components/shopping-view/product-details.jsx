import { useState, useEffect } from "react";
import { Separator } from "/components/ui/separator";
import { Button } from "../ui/button";
import { DialogContent, Dialog } from "/components/ui/dialog";
import { Avatar, AvatarFallback } from "/components/ui/avatar";
import { Star as StarIcon, ShoppingCart, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import { addToCart, fetchCartItems } from "/src/store/shop/cart-slice";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "/src/hooks/use-toast";
import { setProductDetails } from "/src/store/shop/products-slice";
import { Badge } from "/components/ui/badge";
import StarRatingComponent from "../common/star-rating";
import HalfStar from "../common/half-stars";
import {
	addReview,
	getReviews,
	deleteReview,
	clearError,
} from "/src/store/shop/review-slice";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
	const [reviewMsg, setReviewMsg] = useState("");
	const [rating, setRating] = useState(0);
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const cartItems = useSelector(
		(state) => state.shopCart.cartItems.items || []
	);
	const { toast } = useToast();
	const { productReviews, error } = useSelector((state) => state.shopReview);
	const [isAdding, setIsAdding] = useState(false);
	const [localError, setLocalError] = useState("");

	const cartItem = cartItems.find(
		(item) => item.productId === productDetails?._id
	);
	const currentQuantityInCart = cartItem ? cartItem.quantity : 0;
	const [localQuantityInCart, setLocalQuantityInCart] = useState(
		currentQuantityInCart
	);
	const remainingStock =
		(productDetails?.totalStock || 0) - localQuantityInCart;
	const isDisabled =
		remainingStock <= 0 || productDetails?.totalStock === 0 || isAdding;

	useEffect(() => {
		setLocalQuantityInCart(currentQuantityInCart);
		setIsAdding(false);
	}, [currentQuantityInCart]);

	useEffect(() => {
		if (productDetails !== null) dispatch(getReviews(productDetails?._id));
	}, [dispatch, productDetails]);

	const averageRating =
		productReviews && productReviews.length > 0
			? (
					productReviews.reduce((sum, review) => sum + review.reviewValue, 0) /
					productReviews.length
			  ).toFixed(1)
			: "0.0";

	useEffect(() => {
		if (error) {
			toast({
				title: error.message || "An error occurred",
				variant: "destructive",
			});
			dispatch(clearError());
		}
	}, [error, dispatch, toast]);

	const userHasReviewed = productReviews.some(
		(review) => review.userId === user?.id
	);

	function handleRatingChange(getRating) {
		setRating(getRating);
		if (localError) setLocalError("");
	}

	function handleAddToCart(getCurrentProductId) {
		if (isDisabled) {
			toast({
				title: "No more stock available for this product",
				variant: "destructive",
			});
			return Promise.resolve();
		}
		setIsAdding(true);
		setLocalQuantityInCart((prev) => prev + 1);

		return dispatch(
			addToCart({
				userId: user?.id,
				productId: getCurrentProductId,
				quantity: 1,
			})
		)
			.then((data) => {
				if (data?.payload?.success) {
					dispatch(fetchCartItems(user?.id));
					toast({
						title: "Product added to cart successfully",
					});
				}
			})
			.finally(() => {
				setIsAdding(false);
			});
	}

	function handleDialogClose() {
		setOpen(false);
		dispatch(setProductDetails());
		setRating(0);
		setReviewMsg("");
		setLocalError("");
	}

	function handleAddReview() {
		if (rating === 0) {
			setLocalError("Please select a rating.");
			return;
		}
		dispatch(
			addReview({
				productId: productDetails?._id,
				userId: user?.id,
				userName: user?.userName,
				reviewMessage: reviewMsg,
				reviewValue: rating,
			})
		).then((data) => {
			if (data?.payload?.success) {
				dispatch(getReviews(productDetails?._id));
				toast({
					title: "Review added successfully",
				});
				setReviewMsg("");
				setRating(0);
				setLocalError("");
			} else if (data?.payload?.message) {
				setLocalError(data.payload.message);
			}
		});
	}

	function handleDeleteReview(reviewId) {
		dispatch(deleteReview(reviewId))
			.then((data) => {
				if (data?.payload?.success) {
					dispatch(getReviews(productDetails?._id));
					toast({
						title: "Review deleted successfully",
					});
				}
			})
			.catch(() => {
				setLocalError("Error deleting review.");
			});
	}

	const getStarFill = (rating) => {
		const stars = [];
		for (let i = 1; i <= 5; i++) {
			if (rating >= i) {
				stars.push("full");
			} else if (rating >= i - 0.5) {
				stars.push("half");
			} else {
				stars.push("empty");
			}
		}
		return stars;
	};

	const starFill = getStarFill(parseFloat(averageRating));

	return (
		<Dialog open={open} onOpenChange={handleDialogClose}>
			<DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] bg-white rounded-xl shadow-lg overflow-hidden">
				<div className="relative overflow-hidden rounded-lg shadow-md transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl group">
					<img
						src={productDetails?.image}
						alt={productDetails?.title}
						width={600}
						height={600}
						className="aspect-square w-full object-cover transition-transform duration-500 transform group-hover:scale-110"
					/>
					<div className="absolute top-4 left-4 flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-2">
						{remainingStock <= 0 ? (
							<Badge className="bg-red-600 text-white">Out of Stock</Badge>
						) : (
							<>
								{productDetails?.salePrice > 0 && (
									<Badge className="bg-green-500 text-white">Sale</Badge>
								)}
								{remainingStock < 10 && (
									<Badge className="bg-yellow-500 text-white">
										Only {remainingStock} left in stock
									</Badge>
								)}
							</>
						)}
					</div>
				</div>

				{/* Información del Producto */}
				<div className="flex flex-col justify-between">
					<div>
						<h1 className="text-3xl font-extrabold text-gray-800">
							{productDetails?.title}
						</h1>
						<p className="text-gray-600 text-lg mb-5 mt-4">
							{productDetails?.description}
						</p>
						<div className="flex items-center gap-2">
							<div className="flex items-center gap-0.5">
								{starFill.map((fill, index) => {
									if (fill === "full") {
										return (
											<StarIcon
												key={index}
												className="w-5 h-5 fill-yellow-400"
											/>
										);
									} else if (fill === "half") {
										return <HalfStar key={index} />;
									} else {
										return (
											<StarIcon key={index} className="w-5 h-5 text-blue-300" />
										);
									}
								})}
							</div>
							<span className="text-gray-500">({averageRating})</span>
						</div>
					</div>

					{/* Precios */}
					<div className="flex items-center justify-between mt-4">
						<p
							className={`text-3xl font-bold ${
								productDetails?.salePrice > 0
									? "line-through text-gray-500"
									: "text-primary"
							}`}
						>
							${productDetails?.price}
						</p>
						{productDetails?.salePrice > 0 && (
							<p className="text-2xl font-bold text-red-600">
								${productDetails?.salePrice}
							</p>
						)}
					</div>

					{/* Botón de Añadir al Carrito */}
					<div className="mt-5 mb-5">
						<Button
							onClick={() => handleAddToCart(productDetails?._id)}
							className={`w-full ${
								isDisabled
									? "bg-gray-400 cursor-not-allowed"
									: "bg-blue-600 hover:bg-blue-500"
							} text-white flex items-center justify-center rounded-lg shadow-md transition-colors duration-300`}
							disabled={isDisabled}
						>
							<ShoppingCart className="w-5 h-5 mr-2" />
							{isDisabled ? "Out of Stock" : "Add to Cart"}
						</Button>
					</div>

					<Separator className="bg-gray-200" />

					{/* Sección de Reseñas */}
					<div className="max-h-[300px] overflow-auto">
						<h2 className="text-xl font-bold mb-4 text-gray-800">Reviews</h2>
						<div className="space-y-6">
							{productReviews && productReviews.length > 0 ? (
								productReviews.map((review) => (
									<div className="flex gap-4" key={review._id}>
										<Avatar className="w-10 h-10 border border-gray-300">
											<AvatarFallback>
												{review.userName[0].toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<div className="flex-1">
											<div className="flex items-center justify-between">
												<h3 className="font-bold text-gray-800">
													{review.userName}
												</h3>
												{user?.id === review.userId && (
													<Trash2
														className="w-4 h-4 text-red-500 cursor-pointer"
														onClick={() => handleDeleteReview(review._id)}
													/>
												)}
											</div>
											<div className="flex items-center gap-0.5 mt-1">
												{[...Array(5)].map((_, index) => (
													<StarIcon
														key={index}
														className={`w-5 h-5 ${
															index < review.reviewValue
																? "fill-yellow-500"
																: "fill-gray-300"
														}`}
													/>
												))}
											</div>
											<p className="text-gray-600 mt-2">
												{review.reviewMessage}
											</p>
										</div>
									</div>
								))
							) : (
								<p className="text-gray-500">No reviews yet.</p>
							)}
						</div>
						<div className="mt-10 flex-col flex gap-2">
							<label className="font-semibold text-gray-700">
								Write a review
							</label>
							{!userHasReviewed ? (
								<>
									<div className="flex gap-1">
										<StarRatingComponent
											rating={rating}
											handleRatingChange={handleRatingChange}
										/>
									</div>
									{localError && <p className="text-red-500">{localError}</p>}
									<Input
										name="reviewMsg"
										value={reviewMsg}
										onChange={(e) => setReviewMsg(e.target.value)}
										placeholder="Add a review..."
										className="mt-2"
									/>
									<Button
										onClick={handleAddReview}
										disabled={reviewMsg.trim() === ""}
										className="mt-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg shadow-md"
									>
										Submit
									</Button>
								</>
							) : (
								<p className="text-red-500">
									You have already reviewed this product.
								</p>
							)}
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default ProductDetailsDialog;
