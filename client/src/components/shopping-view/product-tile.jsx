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
					{product?.salePrice > 0 && (
						<Badge className="absolute top-2 left-2 bg-red-500 text-white">
							Sale
						</Badge>
					)}
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
					onClick={() => handleAddToCart(product?._id)}
					className="w-full bg-gray-800 text-white hover:bg-gray-700 flex items-center justify-center"
				>
					<ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
				</Button>
			</CardFooter>
		</Card>
	);
}

export default ShoppingProductTile;
