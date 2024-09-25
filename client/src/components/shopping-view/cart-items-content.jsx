import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartItem, updateCartQuantity } from "/src/store/shop/cart-slice";
import { useToast } from "/src/hooks/use-toast";

function UserCartItemsContent({ cartItem }) {
	const { user } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const { toast } = useToast();

	const handleUpdateQuantity = (getCartItem, getAction) => {
		const newQuantity =
			getAction === "minus"
				? getCartItem?.quantity - 1
				: getCartItem?.quantity + 1;

		if (newQuantity < 1) {
			return;
		}

		dispatch(
			updateCartQuantity({
				userId: user?.id,
				productId: getCartItem?.productId,
				quantity: newQuantity,
			})
		).then((data) => {
			if (data?.payload?.success) {
				toast({
					title: "Quantity updated successfully",
				});
			}
		});
	};

	const handleCartItemDelete = (getCartItem) => {
		dispatch(
			deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
		).then((data) => {
			if (data?.payload?.success) {
				toast({
					title: "Product deleted successfully",
				});
			}
		});
	};

	const totalPrice =
		(cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
		cartItem?.quantity;

	return (
		<div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
			<div className="flex items-center space-x-4">
				<img
					src={cartItem?.image}
					alt={cartItem?.title}
					className="w-16 h-16 rounded object-cover"
				/>
				<div>
					<h3 className="font-semibold text-gray-800">
						{cartItem?.title || "N/A"}
					</h3>
					<div className="flex items-center mt-2 space-x-2">
						<Button
							variant="outline"
							className="h-8 w-8 rounded-full p-0"
							onClick={() => handleUpdateQuantity(cartItem, "minus")}
						>
							<Minus className="w-4 h-4 text-gray-700" />
							<span className="sr-only">Decrease</span>
						</Button>
						<span className="font-medium text-gray-700">
							{cartItem?.quantity}
						</span>
						<Button
							variant="outline"
							className="h-8 w-8 rounded-full p-0"
							onClick={() => handleUpdateQuantity(cartItem, "plus")}
						>
							<Plus className="w-4 h-4 text-gray-700" />
							<span className="sr-only">Increase</span>
						</Button>
					</div>
				</div>
			</div>
			<div className="flex flex-col items-end space-y-2">
				<p className="font-semibold text-gray-800">${totalPrice.toFixed(2)}</p>
				<Button
					variant="ghost"
					className="text-red-600 hover:text-red-800 p-1"
					onClick={() => handleCartItemDelete(cartItem)}
				>
					<Trash className="w-5 h-5" />
					<span className="sr-only">Delete</span>
				</Button>
			</div>
		</div>
	);
}

export default UserCartItemsContent;
