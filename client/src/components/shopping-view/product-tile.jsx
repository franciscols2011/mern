import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { CardFooter, CardContent, Card } from "/components/ui/card";
import { Badge } from "/components/ui/badge";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import { categoryOptionsMap, brandOptionsMap } from "/src/config";

function ShoppingProductTile({
	product,
	handleGetProductDetails,
	handleAddToCart,
}) {
	const cartItems = useSelector(
		(state) => state.shopCart.cartItems.items || []
	);
	const cartItem = cartItems.find((item) => item.productId === product._id);
	const currentQuantityInCart = cartItem ? cartItem.quantity : 0;

	const [localQuantityInCart, setLocalQuantityInCart] = useState(
		currentQuantityInCart
	);

	const [isAdding, setIsAdding] = useState(false);

	useEffect(() => {
		setLocalQuantityInCart(currentQuantityInCart);
		setIsAdding(false);
	}, [currentQuantityInCart]);

	const remainingStock = product.totalStock - localQuantityInCart;

	const isDisabled =
		localQuantityInCart >= product.totalStock ||
		product.totalStock === 0 ||
		isAdding;

	const handleAdd = () => {
		if (!isDisabled) {
			setIsAdding(true);
			setLocalQuantityInCart((prev) => prev + 1);

			handleAddToCart(product?._id, product?.totalStock).finally(() => {
				setIsAdding(false);
			});
		}
	};

	return (
		<Card className="w-full max-w-sm mx-auto bg-white rounded-xl shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
			<div
				onClick={() => handleGetProductDetails(product?._id)}
				className="cursor-pointer relative group"
			>
				<div className="relative">
					<img
						src={product?.image}
						alt={product?.title}
						className="w-full h-80 object-cover transition-transform duration-500 transform group-hover:scale-110"
					/>
					<div className="absolute top-4 left-4 flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
						{remainingStock <= 0 ? (
							<Badge className="bg-red-600 text-white">Out of Stock</Badge>
						) : (
							<>
								{product?.salePrice > 0 && (
									<Badge className="bg-green-500 text-white">Sale</Badge>
								)}
								{remainingStock < 10 && (
									<Badge className="bg-yellow-500 text-white">
										Only {remainingStock} left
									</Badge>
								)}
							</>
						)}
					</div>
				</div>
				<CardContent className="p-6">
					<h2 className="text-2xl font-semibold text-gray-800 mb-2">
						{product?.title}
					</h2>
					<div className="flex justify-between items-center mb-4">
						<span className="text-sm text-gray-600">
							{categoryOptionsMap[product?.category]}
						</span>
						<span className="text-sm text-gray-600">
							{brandOptionsMap[product?.brand]}
						</span>
					</div>
					<div className="flex items-baseline space-x-2">
						<span
							className={`${
								product?.salePrice > 0
									? "line-through text-gray-500"
									: "text-lg font-semibold text-blue-600"
							}`}
						>
							${product?.price}
						</span>
						{product?.salePrice > 0 && (
							<span className="text-lg font-bold text-red-600">
								${product?.salePrice}
							</span>
						)}
					</div>
				</CardContent>
			</div>
			<CardFooter className="p-4 bg-gray-50">
				<Button
					onClick={handleAdd}
					className={`w-full ${
						isDisabled
							? "bg-gray-400 cursor-not-allowed"
							: "bg-blue-600 hover:bg-blue-500"
					} text-white flex items-center justify-center rounded-md transition-colors duration-300`}
					disabled={isDisabled}
				>
					<ShoppingCart className="w-5 h-5 mr-2" />
					{isDisabled ? "Out of Stock" : "Add to Cart"}
				</Button>
			</CardFooter>
		</Card>
	);
}

export default ShoppingProductTile;
