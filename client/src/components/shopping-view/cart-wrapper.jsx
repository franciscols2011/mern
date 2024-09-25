import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import UserCartItemsContent from "./cart-items-content";
import { SheetHeader, SheetTitle, SheetContent } from "/components/ui/sheet";
import { Badge } from "/components/ui/badge";
import { ShoppingCart } from "lucide-react";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
	const navigate = useNavigate();

	const totalCartItems =
		cartItems && cartItems.length > 0
			? cartItems.reduce(
					(sum, currentItem) =>
						sum +
						(currentItem?.salePrice > 0
							? currentItem?.salePrice
							: currentItem?.price) *
							currentItem?.quantity,
					0
			  )
			: 0;

	return (
		<SheetContent className="sm:max-w-md p-6 bg-white rounded-lg shadow-lg">
			<SheetHeader className="flex items-center justify-between mb-4">
				<SheetTitle className="flex items-center text-2xl font-bold text-gray-800">
					<ShoppingCart className="h-6 w-6 mr-2 text-gray-700" /> Your Cart
				</SheetTitle>
			</SheetHeader>
			<div className="space-y-4">
				{cartItems && cartItems.length > 0 ? (
					cartItems.map((item) => (
						<UserCartItemsContent key={item._id} cartItem={item} />
					))
				) : (
					<div className="flex flex-col items-center justify-center py-10">
						<ShoppingCart className="h-12 w-12 text-gray-400 mb-4" />
						<p className="text-gray-500">Your cart is empty.</p>
					</div>
				)}
			</div>
			{cartItems && cartItems.length > 0 && (
				<div className="mt-8 border-t border-gray-200 pt-4">
					<div className="flex justify-between items-center mb-4">
						<span className="text-lg font-semibold text-gray-700">Total:</span>
						<span className="text-lg font-semibold text-gray-900">
							${totalCartItems.toFixed(2)}
						</span>
					</div>
					<Button
						onClick={() => {
							navigate("/shop/checkout");
							setOpenCartSheet(false);
						}}
						className="w-full bg-gray-800 text-white hover:bg-gray-700 flex items-center justify-center"
					>
						Checkout
					</Button>
				</div>
			)}
		</SheetContent>
	);
}

export default UserCartWrapper;
