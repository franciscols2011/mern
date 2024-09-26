import { useState, useEffect } from "react";
import { Separator } from "/components/ui/separator";
import { Button } from "../ui/button";
import { DialogContent } from "/components/ui/dialog";
import { Dialog } from "/components/ui/dialog";
import { Avatar } from "/components/ui/avatar";
import { AvatarFallback } from "/components/ui/avatar";
import { StarIcon, ShoppingCart } from "lucide-react";
import { Input } from "../ui/input";
import { addToCart, fetchCartItems } from "/src/store/shop/cart-slice";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "/src/hooks/use-toast";
import { setProductDetails } from "/src/store/shop/products-slice";
import { Badge } from "/components/ui/badge";

function ProductDetailsDialog({ open, setOpen, productDetails }) {
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const cartItems = useSelector(
		(state) => state.shopCart.cartItems.items || []
	);
	const { toast } = useToast();

	const cartItem = cartItems.find(
		(item) => item.productId === productDetails?._id
	);
	const currentQuantityInCart = cartItem ? cartItem.quantity : 0;

	const [localQuantityInCart, setLocalQuantityInCart] = useState(
		currentQuantityInCart
	);

	const [isAdding, setIsAdding] = useState(false);

	useEffect(() => {
		setLocalQuantityInCart(currentQuantityInCart);
		setIsAdding(false);
	}, [currentQuantityInCart]);

	const remainingStock =
		(productDetails?.totalStock || 0) - localQuantityInCart;

	const isDisabled =
		remainingStock <= 0 || productDetails?.totalStock === 0 || isAdding;

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
	}

	return (
		<Dialog open={open} onOpenChange={handleDialogClose}>
			<DialogContent className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
				<div className="relative overflow-hidden rounded-lg">
					<img
						src={productDetails?.image}
						alt={productDetails?.title}
						width={600}
						height={600}
						className="aspect-square w-full object-cover"
					/>
					<div className="absolute top-2 left-2 flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-1">
						{remainingStock <= 0 ? (
							<Badge className="bg-gray-500 text-white">Out of Stock</Badge>
						) : (
							<>
								{productDetails?.salePrice > 0 && (
									<Badge className="bg-red-500 text-white">Sale</Badge>
								)}
								{remainingStock < 10 && (
									<Badge className="bg-yellow-500 text-white">{`Only ${remainingStock} left in stock`}</Badge>
								)}
							</>
						)}
					</div>
				</div>
				<div className="grid gap-4">
					<div>
						<h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
						<p className="text-muted-foreground text-2xl mb-5 mt-4">
							{productDetails?.description}
						</p>
					</div>
					<div className="flex items-center justify-between">
						<p
							className={`text-3xl font-bold text-primary ${
								productDetails?.salePrice > 0 ? "line-through" : ""
							}`}
						>
							${productDetails?.price}
						</p>
						{productDetails?.salePrice > 0 ? (
							<p className="text-2xl font-bold text-muted-foreground">
								${productDetails?.salePrice}
							</p>
						) : null}
					</div>
					<div className="flex items-center gap-2 mt-2">
						<div className="flex items-center gap-0.5">
							<StarIcon className="w-5 h-5 fill-primary" />
							<StarIcon className="w-5 h-5 fill-primary" />
							<StarIcon className="w-5 h-5 fill-primary" />
							<StarIcon className="w-5 h-5 fill-primary" />
							<StarIcon className="w-5 h-5 fill-primary" />
						</div>
						<span className="text-muted-foreground">(4.5)</span>
					</div>
					<div className="mt-5 mb-5">
						<Button
							onClick={() => handleAddToCart(productDetails?._id)}
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
					</div>
					<Separator className="bg-gray-200" />
					<div className="max-h-[300px] overflow-auto">
						<h2 className="text-xl font-bold mb-4">Reviews</h2>
						<div className="grid gap-6">
							<div className="flex gap-4">
								<Avatar className="w-10 h-10 border">
									<AvatarFallback>JD</AvatarFallback>
								</Avatar>
								<div className="grid gap-1">
									<div className="flex items-center gap-2">
										<h3 className="font-bold">John Doe</h3>
									</div>
									<div className="flex items-center gap-0.5">
										<StarIcon className="w-5 h-5 fill-primary" />
										<StarIcon className="w-5 h-5 fill-primary" />
										<StarIcon className="w-5 h-5 fill-primary" />
										<StarIcon className="w-5 h-5 fill-primary" />
										<StarIcon className="w-5 h-5 fill-primary" />
									</div>
									<p className="text-muted-foreground">
										This is a very good product!
									</p>
								</div>
							</div>
						</div>
						<div className="mt-6 flex gap-2">
							<Input placeholder="Add a review..." />
							<Button>Submit</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default ProductDetailsDialog;
