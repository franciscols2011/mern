import { useState, useEffect } from "react";
import { Button } from "/src/components/ui/button";
import bannerOne from "/src/assets/banner-1.jpeg";
import bannerTwo from "/src/assets/banner-2.png";
import bannerThree from "/src/assets/banner-3.jpg";
import {
	Airplay,
	BabyIcon,
	CloudLightning,
	Heater,
	Images,
	ShirtIcon,
	ShoppingBasket,
	UmbrellaIcon,
	WashingMachine,
	WatchIcon,
	Filter,
} from "lucide-react";
import { Card, CardContent } from "/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import {
	fetchAllFilteredProducts,
	fetchProductDetails,
} from "/src/store/shop/products-slice";
import ShoppingProductTile from "/src/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "/src/store/shop/cart-slice";
import { useToast } from "/src/hooks/use-toast";
import ProductDetailsDialog from "/src/components/shopping-view/product-details";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "/src/lib/utils";

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
		const currentFilter = {
			[section]: [getCurrentItem.id],
		};

		const params = new URLSearchParams();
		for (const [key, value] of Object.entries(currentFilter)) {
			if (value.length > 0) {
				params.set(key, value.join(","));
			}
		}

		navigate(`/shop/listing?${params.toString()}`);
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
	}, [slides.length]);

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
			{/* Carousel Section */}
			<div className="relative w-full h-[600px] overflow-hidden">
				{slides.map((slide, index) => (
					<div
						key={index}
						className={cn("absolute inset-0 transition-opacity duration-1000", {
							"opacity-100": index === currentSlide,
							"opacity-0": index !== currentSlide,
						})}
					>
						<img
							src={slide}
							alt={`Slide ${index + 1}`}
							className="w-full h-full object-cover"
						/>
						{/* Overlay Content */}
						<div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
							<div className="text-center text-white px-4">
								<h2 className="text-4xl md:text-6xl font-extrabold mb-4">
									Welcome to Our Store
								</h2>
								<p className="text-lg md:text-2xl mb-8">
									Discover the latest trends in fashion
								</p>
								<Button
									onClick={() => navigate("/shop/listing")}
									className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full text-lg"
								>
									Shop Now
								</Button>
							</div>
						</div>
					</div>
				))}

				{/* Navigation Buttons */}
				<Button
					variant="outline"
					size="icon"
					onClick={() =>
						setCurrentSlide(
							(prevSlide) => (prevSlide - 1 + slides.length) % slides.length
						)
					}
					className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/70 hover:bg-white z-10"
				>
					<ChevronLeft className="w-6 h-6 text-gray-800" />
					<span className="sr-only">Previous Slide</span>
				</Button>
				<Button
					variant="outline"
					size="icon"
					onClick={() =>
						setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
					}
					className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/70 hover:bg-white z-10"
				>
					<ChevronRight className="w-6 h-6 text-gray-800" />
					<span className="sr-only">Next Slide</span>
				</Button>

				{/* Dots Navigation */}
				<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
					{slides.map((_, index) => (
						<button
							key={index}
							onClick={() => setCurrentSlide(index)}
							className={cn(
								"w-3 h-3 rounded-full bg-white transition-opacity duration-300",
								{
									"opacity-100": index === currentSlide,
									"opacity-50": index !== currentSlide,
								}
							)}
						></button>
					))}
				</div>
			</div>

			{/* Shop by Category Section */}
			<section className="py-12 bg-gray-50">
				<div className="container mx-auto px-4">
					<h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
						Shop by Category
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
						{categoriesWithIcons.map(({ id, label, icon: Icon }) => (
							<Card
								onClick={() =>
									handleNavigateToListingPage({ id, label }, "category")
								}
								key={id}
								className="cursor-pointer hover:shadow-xl transition-transform transform hover:-translate-y-2 rounded-lg p-6 flex flex-col items-center justify-center bg-white text-gray-800"
							>
								<CardContent className="flex flex-col items-center justify-center gap-4">
									<Icon className="w-16 h-16 text-primary" />
									<span className="font-bold text-xl">{label}</span>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Shop by Brand Section */}
			<section className="py-12 bg-gray-100">
				<div className="container mx-auto px-4">
					<h2 className="text-4xl font-bold text-center text-gray-800 mb-12">
						Shop by Brand
					</h2>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
						{brandWithIcon.map(({ id, label, icon: Icon }) => (
							<Card
								onClick={() =>
									handleNavigateToListingPage({ id, label }, "brand")
								}
								key={id}
								className="cursor-pointer hover:shadow-xl transition-transform transform hover:-translate-y-2 rounded-lg p-6 flex flex-col items-center justify-center bg-white text-gray-800"
							>
								<CardContent className="flex flex-col items-center justify-center gap-4">
									<Icon className="w-16 h-16 text-primary" />
									<span className="font-bold text-xl text-gray-800">
										{label}
									</span>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			{/* Featured Products Section */}
			<section className="py-16 bg-gray-100">
				<div className="container mx-auto px-4">
					<h2 className="text-5xl font-extrabold text-center text-gray-900 mb-16">
						Featured Products
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 ">
						{productList && productList.length > 0 ? (
							productList
								.slice(0, 8)
								.map((productItem) => (
									<ShoppingProductTile
										key={productItem.id}
										handleGetProductDetails={handleGetProductDetails}
										product={productItem}
										handleAddToCart={handleAddToCart}
									/>
								))
						) : (
							<p className="text-center text-gray-500 w-full col-span-full">
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
