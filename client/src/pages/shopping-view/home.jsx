import { Button } from "/src/components/ui/button";
import bannerOne from "/src/assets/banner-1.webp";
import bannerTwo from "/src/assets/banner-2.webp";
import bannerThree from "/src/assets/banner-3.webp";
import {
	BabyIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	CloudLightning,
	ShirtIcon,
	UmbrellaIcon,
	WatchIcon,
} from "lucide-react";
import { Card } from "/components/ui/card";
import { CardContent } from "/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "/src/store/shop/products-slice";
import ShoppingProductTile from "/src/components/shopping-view/product-tile";

const categoriesWithIcons = [
	{ id: "men", label: "Men", icon: ShirtIcon },
	{ id: "women", label: "Women", icon: CloudLightning },
	{ id: "kids", label: "Kids", icon: BabyIcon },
	{ id: "accessories", label: "Accessories", icon: WatchIcon },
	{ id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

function ShoppingHome() {
	const [currentSlide, setCurrentSlide] = useState(0);

	const { productList } = useSelector((state) => state.shopProducts);

	const dispatch = useDispatch();

	const slides = [bannerOne, bannerTwo, bannerThree];

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

	console.log(productList, "productList");

	return (
		<div className="flex flex-col min-h-screen">
			<div className="relative w-full h-[600px] overflow-hidden">
				{slides.map((slide, index) => (
					<img
						src={slide}
						alt=""
						key={index}
						className={`${
							index === currentSlide ? "opacity-100" : "opacity-0"
						} absolute top-0 left-0 w-full h-full object-cover transition-opacity`}
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
					className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
				>
					<ChevronLeftIcon className="w-4 h-4" />
				</Button>
				<Button
					variant="outline"
					size="icon"
					onClick={() =>
						setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length)
					}
					className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
				>
					<ChevronRightIcon className="w-4 h-4" />
				</Button>
			</div>

			<section className="py-12 bg-gray-50">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-center mb-8">Shop now</h2>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
						{categoriesWithIcons.map(({ id, label, icon: Icon }) => (
							<Card
								key={id}
								className="cursor-pointer hover:shadow-lg transition-shadow"
							>
								<CardContent className="flex flex-col items-center justify-center gap-4 p-6">
									<Icon className="w-12 h-12 text-primary" />
									<span className="font-bold">{label}</span>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>

			<section className="py-12">
				<div className="container mx-auto px-4">
					<h2 className="text-3xl font-bold text-center mb-8">
						{" "}
						Features Products
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
						{productList && productList.length > 0
							? productList.map((productItem) => (
									<ShoppingProductTile product={productItem} />
							  ))
							: null}
					</div>
				</div>
			</section>
		</div>
	);
}

export default ShoppingHome;
