import Address from "/src/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "/src/components/shopping-view/cart-items-content";
import { Button } from "/src/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "/src/store/shop/order-slice";
import { useToast } from "/src/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

function ShoppingCheckout() {
	const { cartItems } = useSelector((state) => state.shopCart);
	const { user } = useSelector((state) => state.auth);
	const { approvalURL } = useSelector((state) => state.shopOrder);
	const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
	const [isPaymentStart, setIsPaymentStart] = useState(false);
	const dispatch = useDispatch();
	const { toast } = useToast();

	const totalCartAmount =
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

	function handleInitialPaypalPayment() {
		if (isPaymentStart) return;

		if (!cartItems || cartItems.items.length === 0) {
			toast({
				title: "Your cart is empty",
				variant: "destructive",
			});
			return;
		}

		if (currentSelectedAddress === null) {
			toast({
				title: "Please select an address",
				variant: "destructive",
			});
			return;
		}

		setIsPaymentStart(true);

		const orderData = {
			userId: user?.id,
			cartId: cartItems._id,
			cartItems: cartItems.items.map((singleCartItem) => ({
				productId: singleCartItem?.productId,
				title: singleCartItem?.title,
				image: singleCartItem?.image,
				price:
					singleCartItem?.salePrice > 0
						? singleCartItem?.salePrice
						: singleCartItem?.price,
				quantity: singleCartItem?.quantity,
			})),
			addressInfo: {
				addressId: currentSelectedAddress?._id,
				address: currentSelectedAddress?.address,
				city: currentSelectedAddress?.city,
				pincode: currentSelectedAddress?.pincode,
				phone: currentSelectedAddress?.phone,
				notes: currentSelectedAddress?.notes,
			},
			orderStatus: "pending",
			paymentMethod: "paypal",
			paymentStatus: "pending",
			totalAmount: totalCartAmount,
			orderDate: new Date(),
			orderUpdateDate: new Date(),
			paymentId: "",
			payerId: "",
		};

		dispatch(createNewOrder(orderData)).then((data) => {
			if (data?.payload?.success) {
				setIsPaymentStart(false);
			} else {
				setIsPaymentStart(false);
			}
		});
	}

	useEffect(() => {
		if (approvalURL) {
			window.location.href = approvalURL;
		}
	}, [approvalURL]);

	return (
		<div className="flex flex-col min-h-screen">
			<div className="relative w-full h-64 md:h-96 overflow-hidden">
				<img
					src={img}
					alt="Account"
					className="w-full h-full object-cover object-center"
				/>
			</div>
			<div className="container mx-auto px-4 py-8">
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
					<Address
						selectedId={currentSelectedAddress?._id}
						setCurrentSelectedAddress={setCurrentSelectedAddress}
					/>
					<div className="flex flex-col gap-6">
						{cartItems && cartItems.items && cartItems.items.length > 0 ? (
							cartItems.items.map((item) => (
								<div
									key={item._id}
									className="bg-white rounded-lg shadow-md p-4"
								>
									<UserCartItemsContent cartItem={item} />
									<div className="flex justify-between items-center mt-4">
										{item.salePrice > 0 ? (
											<div className="flex items-center space-x-2">
												<span className="text-lg text-gray-500 line-through">
													${(item.price * item.quantity).toFixed(2)}
												</span>
												<span className="text-xl font-bold text-red-600">
													${(item.salePrice * item.quantity).toFixed(2)}
												</span>
											</div>
										) : (
											<span className="text-xl font-bold text-gray-800">
												${(item.price * item.quantity).toFixed(2)}
											</span>
										)}
									</div>
								</div>
							))
						) : (
							<p className="text-gray-500">Your cart is empty.</p>
						)}
						<div className="mt-8 p-4 bg-gray-50 rounded-lg">
							<div className="flex justify-between items-center">
								<span className="text-lg font-semibold text-gray-700">
									Total:
								</span>
								<span className="text-2xl font-bold text-gray-900">
									${totalCartAmount.toFixed(2)}
								</span>
							</div>
						</div>
						<div className="mt-4">
							<Button
								onClick={handleInitialPaypalPayment}
								disabled={isPaymentStart}
								className="w-full bg-gray-800 text-white hover:bg-gray-700 flex items-center justify-center"
							>
								{isPaymentStart ? (
									<Loader2 className="w-5 h-5 mr-2 animate-spin" />
								) : null}
								{isPaymentStart
									? "Checking Payment..."
									: "Checkout with PayPal"}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ShoppingCheckout;
