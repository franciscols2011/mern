import Address from "/src/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useSelector } from "react-redux";
import UserCartItemsContent from "/src/components/shopping-view/cart-items-content";
import { Button } from "/src/components/ui/button";

function ShoppingCheckout() {
	const { cartItems } = useSelector((state) => state.shopCart);

	const totalCartItems =
		cartItems && cartItems.items && cartItems.items.length > 0
			? cartItems.items.reduce(
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
		<div className="flex flex-col">
			<div className="relative h-[300px] w-full overflow-hidden">
				<img src={img} className="h-full w-full object-cover object-center" />
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
				<Address />
				<div className="flex flex-col gap-4">
					{cartItems && cartItems.items && cartItems.items.length > 0
						? cartItems.items.map((item) => (
								<div key={item._id}>
									<UserCartItemsContent cartItem={item} />
									<div className="flex justify-between items-center mt-2">
										{item.salePrice > 0 ? (
											<div className="flex items-center">
												<span className="text-gray-500 line-through mr-2">
													${(item.price * item.quantity).toFixed(2)}
												</span>
												<span className="font-bold text-red-500">
													${(item.salePrice * item.quantity).toFixed(2)}
												</span>
											</div>
										) : (
											""
										)}
									</div>
								</div>
						  ))
						: null}

					<div className="mt-8 space-y-4">
						<div className="flex justify-between">
							<span className="font-bold">Total</span>
							<span className="font-bold">${totalCartItems.toFixed(2)}</span>
						</div>
					</div>
					<div className="mt-4 w-full justify-center">
						<Button className="w-full">Checkout with PayPal</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ShoppingCheckout;
