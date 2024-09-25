import { Button } from "/src/components/ui/button";
import bannerOne from "/src/assets/banner-1.webp";
import bannerTwo from "/src/assets/banner-2.webp";
import bannerThree from "/src/assets/banner-3.webp";
import {
	Airplay,
	BabyIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	CloudLightning,
	Heater,
	Images,
	ShirtIcon,
	ShoppingBasket,
	UmbrellaIcon,
	WashingMachine,
	WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchAllFilteredProducts,
	fetchProductDetails,
	setProductDetails,
} from "/src/store/shop/products-slice";
import ShoppingProductTile from "/src/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "/src/store/shop/cart-slice";
import { useToast } from "/src/hooks/use-toast";
import ProductDetailsDialog from "/src/components/shopping-view/product-details";
import { ChevronLeft, ChevronRight } from "lucide-react";

const categoriesWithIcons = [
	{ id: "men", label: "Men", icon: ShirtIcon },
	{ id: "women", label: "Women", icon: CloudLightning },
	{ id: "kids", label: "Kids", icon: BabyIcon },
	{ id: "accessories", label: "Accessories", icon: WatchIcon },
	{ id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandWithIcon = [
	{ id: "nike", label: "Nike", icon: ShirtIcon },
	{ id: "adidas", label: "Adidas", icon: WashingMachine },
	{ id: "puma", label: "Puma", icon: ShoppingBasket },
	{ id: "levi", label: "Levi's", icon: Airplay },
	{ id: "zara", label: "Zara", icon: Images },
	{ id: "h&m", label: "H&M", icon: Heater },
];

function ShoppingHome() {
	const [currentSlide, setCurrentSlide] = useState(0);
	const { productList, productDetails } = useSelector(
		(state) => state.shopProducts
	);
	const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
	const { user } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const slides = [bannerOne, bannerTwo, bannerThree];
	const { toast } = useToast();

	function handleNavigateToListingPage(getCurrentItem, section) {
		sessionStorage.removeItem("filters");
		const currentFilter = {
			[section]: [getCurrentItem.id],
		};
		sessionStorage.setItem("filters", JSON.stringify(currentFilter));
		navigate("/shop/listing");
	}

	function handleGetProductDetails(getCurrentProductId) {
		dispatch(fetchProductDetails(getCurrentProductId));
	}

	function handleAddToCart(getCurrentProductId) {
		dispatch(
			addToCart({
				userId: user?.id,
				productId: getCurrentProductId,
				quantity: 1,
			})
		).then((data) => {
			if (data?.payload?.success) {
				dispatch(fetchCartItems(user?.id));
				toast({
					title: "Product added to cart successfully",
				});
			}
		});
	}

	useEffect(() => {
		if (productDetails !== null) setOpenDetailsDialog(true);
	}, [productDetails]);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
		}, 5000);
		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		dispatch(
			fetchAllFilteredProducts({
				filterParams: {},
				sortParams: "price-lowtohigh",
			})
		);
	}, [dispatch]);

	return (
		<div className="flex flex-col min-h-screen">
			<div className="relative w-full h-[600px] overflow-hidden">
				{slides.map((slide, index) => (
					<img
						src={slide}
						alt={`Slide ${index + 1}`}
						key={index}
						className={`${
							index === currentSlide ? "opacity-100" : "opacity-0"
						} absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
					/>
				))}

				<Button
					variant="outline"
					size="icon"
					onClick={() =>
						setCurrentSlide(
							(prevSlide) => (prevSlide - 1 + slides.length) % slides.length
						)
					}
					className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80 hover:bg-white"
				>
					<ChevronLeftIcon className="w-6 h-6 text-gray-800" />
					<span className="sr-only">Previous Slide</span>
				</Button>
				<Button
					variant="outline"
					size="icon"
					onClick={() =>
						setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
					}
					className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80 hover:bg-white"
				>
					<ChevronRightIcon className="w-6 h-6 text-gray-800" />
					<span className="sr-only">Next Slide</span>
				</Button>
			</div>

			<section className="py-12 bg-gray-50">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-center mb-8">Shop Now</h2>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
						{categoriesWithIcons.map(({ id, label, icon: Icon }) => (
							<Card
								onClick={() =>
									handleNavigateToListingPage({ id, label }, "category")
								}
								key={id}
								className="cursor-pointer hover:shadow-lg transition-shadow rounded-lg p-4 flex flex-col items-center justify-center"
							>
								<CardContent className="flex flex-col items-center justify-center gap-4">
									<Icon className="w-12 h-12 text-primary" />
									<span className="font-bold text-gray-800">{label}</span>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			<section className="py-12 bg-gray-50">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
						{brandWithIcon.map(({ id, label, icon: Icon }) => (
							<Card
								onClick={() =>
									handleNavigateToListingPage({ id, label }, "brand")
								}
								key={id}
								className="cursor-pointer hover:shadow-lg transition-shadow rounded-lg p-4 flex flex-col items-center justify-center"
							>
								<CardContent className="flex flex-col items-center justify-center gap-4">
									<Icon className="w-12 h-12 text-primary" />
									<span className="font-bold text-gray-800">{label}</span>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			<section className="py-12">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-center mb-8">
						Featured Products
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{productList && productList.length > 0 ? (
							productList.map((productItem) => (
								<ShoppingProductTile
									key={productItem.id}
									handleGetProductDetails={handleGetProductDetails}
									product={productItem}
									handleAddToCart={handleAddToCart}
								/>
							))
						) : (
							<p className="text-center text-gray-500 col-span-full">
								No products available.
							</p>
						)}
					</div>
				</div>
			</section>

			<ProductDetailsDialog
				open={openDetailsDialog}
				setOpen={setOpenDetailsDialog}
				productDetails={productDetails}
			/>
		</div>
	);
}

export default ShoppingHome;
