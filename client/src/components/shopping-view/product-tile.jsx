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
		<Card className="w-full max-w-sm mx-auto bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
			<div
				onClick={() => handleGetProductDetails(product?._id)}
				className="cursor-pointer"
			>
				<div className="relative">
					<img
						src={product?.image}
						alt={product?.title}
						className="w-full h-[300px] object-cover rounded-t-lg"
					/>
					<div className="absolute top-2 left-2 flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-1">
						{remainingStock <= 0 ? (
							<Badge className="bg-gray-500 text-white">Out of Stock</Badge>
						) : (
							<>
								{product?.salePrice > 0 && (
									<Badge className="bg-red-500 text-white">Sale</Badge>
								)}
								{remainingStock < 10 && (
									<Badge className="bg-yellow-500 text-white">{`Only ${remainingStock} left in stock`}</Badge>
								)}
							</>
						)}
					</div>
				</div>
				<CardContent className="p-4">
					<h2 className="text-xl font-bold mb-2 text-gray-800">
						{product?.title}
					</h2>
					<div className="flex justify-between items-center mb-2">
						<span className="text-sm text-gray-600">
							{categoryOptionsMap[product?.category]}
						</span>
						<span className="text-sm text-gray-600">
							{brandOptionsMap[product?.brand]}
						</span>
					</div>
					<div className="flex justify-between items-center">
						<span
							className={`${
								product?.salePrice > 0
									? "line-through text-gray-500"
									: "text-lg font-semibold text-primary"
							}`}
						>
							${product?.price}
						</span>
						{product?.salePrice > 0 && (
							<span className="text-lg font-semibold text-primary">
								${product?.salePrice}
							</span>
						)}
					</div>
				</CardContent>
			</div>
			<CardFooter className="p-4 bg-gray-50 rounded-b-lg">
				<Button
					onClick={handleAdd}
					className={`w-full ${
						isDisabled
							? "bg-gray-400 cursor-not-allowed"
							: "bg-gray-800 hover:bg-gray-700"
					} text-white flex items-center justify-center`}
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
