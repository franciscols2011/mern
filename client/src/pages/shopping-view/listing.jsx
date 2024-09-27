import { ArrowUpDownIcon } from "lucide-react";
import {
	DropdownMenuTrigger,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
} from "/components/ui/dropdown-menu";
import ProductFilter from "/src/components/shopping-view/filter";
import { Button } from "/src/components/ui/button";
import { sortOptions } from "/src/config";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
	fetchAllFilteredProducts,
	fetchProductDetails,
} from "/src/store/shop/products-slice";
import ShoppingProductTile from "/src/components/shopping-view/product-tile";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import ProductDetailsDialog from "/src/components/shopping-view/product-details";
import { addToCart, fetchCartItems } from "/src/store/shop/cart-slice";
import { useToast } from "/src/hooks/use-toast";
import { cn } from "/src/lib/utils";

function ShoppingListing() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { productList, productDetails } = useSelector(
		(state) => state.shopProducts
	);
	const { cartItems } = useSelector((state) => state.shopCart);
	const { user } = useSelector((state) => state.auth);
	const [filters, setFilters] = useState({});
	const [sort, setSort] = useState("price-lowtohigh");
	const [searchParams, setSearchParams] = useSearchParams();
	const location = useLocation();
	const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
	const { toast } = useToast();
	const [searchTerm, setSearchTerm] = useState("");

	function parseSearchParamsToFilters(params) {
		const newFilters = {};
		for (const [key, value] of params.entries()) {
			if (value) {
				if (key === "search") {
					continue;
				}
				const valuesArray = value.split(",").filter((v) => v !== "");
				if (valuesArray.length > 0) {
					newFilters[key] = valuesArray;
				}
			}
		}
		return newFilters;
	}

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		const newFilters = parseSearchParamsToFilters(params);
		setFilters(newFilters);
		const search = params.get("search") || "";
		setSearchTerm(search);
	}, [location.search]);

	useEffect(() => {
		if (filters && sort) {
			dispatch(
				fetchAllFilteredProducts({
					filterParams: filters,
					sortParams: sort,
					searchTerm,
				})
			);
		}
	}, [dispatch, filters, sort, searchTerm]);

	useEffect(() => {
		if (user?.id) {
			dispatch(fetchCartItems(user.id));
		}
	}, [dispatch, user?.id]);

	function handleSort(value) {
		setSort(value);
	}

	function handleFilter(sectionId, optionId) {
		const sectionFilters = filters[sectionId] || [];
		const isOptionSelected = sectionFilters.includes(optionId);
		const updatedSectionFilters = isOptionSelected
			? sectionFilters.filter((id) => id !== optionId)
			: [...sectionFilters, optionId];

		const newFilters = { ...filters };

		if (updatedSectionFilters.length > 0) {
			newFilters[sectionId] = updatedSectionFilters;
		} else {
			delete newFilters[sectionId];
		}

		const params = new URLSearchParams();
		if (searchTerm) {
			params.set("search", searchTerm);
		}
		for (const [key, value] of Object.entries(newFilters)) {
			if (value.length > 0) {
				params.set(key, value.join(","));
			}
		}
		setSearchParams(params);

		setFilters(newFilters);
	}

	function handleGetProductDetails(productId) {
		dispatch(fetchProductDetails(productId));
	}

	function handleAddToCart(productId, totalStock) {
		const getCartItems = cartItems.items || [];
		const cartItem = getCartItems.find((item) => item.productId === productId);
		const currentQuantity = cartItem ? cartItem.quantity : 0;

		if (currentQuantity + 1 > totalStock) {
			toast({
				title: `Only ${totalStock} units are available for this product`,
				variant: "destructive",
			});
			return;
		}

		dispatch(
			addToCart({
				userId: user?.id,
				productId: productId,
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

	return (
		<div className="flex flex-col md:flex-row gap-6 p-4 md:p-6 bg-gray-50 min-h-screen">
			<div className="w-full md:w-1/4">
				<div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
					<h3 className="text-2xl font-bold mb-6 text-gray-800">
						Filter Products
					</h3>
					<ProductFilter filters={filters} handleFilter={handleFilter} />
				</div>
			</div>
			<div className="w-full md:w-3/4">
				<div className="bg-white rounded-lg shadow-lg">
					<div className="p-6 border-b flex flex-col md:flex-row items-center justify-between">
						<h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
							Products
						</h2>
						<div className="flex items-center gap-3">
							<span className="text-gray-600 text-lg">
								{productList?.length || 0} Products
							</span>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										className="flex items-center gap-1 hover:bg-gray-100 transition-colors"
									>
										<ArrowUpDownIcon className="h-5 w-5" />
										<span>Sort by</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56">
									<DropdownMenuRadioGroup
										value={sort}
										onValueChange={handleSort}
									>
										{sortOptions.map((sortItem) => (
											<DropdownMenuRadioItem
												value={sortItem.id}
												key={sortItem.id}
											>
												{sortItem.label}
											</DropdownMenuRadioItem>
										))}
									</DropdownMenuRadioGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
					<div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
						{productList && productList.length > 0 ? (
							productList.map((productItem) => (
								<ShoppingProductTile
									key={productItem._id}
									handleGetProductDetails={handleGetProductDetails}
									product={productItem}
									handleAddToCart={handleAddToCart}
								/>
							))
						) : (
							<p className="text-center text-gray-500 w-full col-span-full">
								No products found.
							</p>
						)}
					</div>
				</div>
			</div>
			<ProductDetailsDialog
				open={openDetailsDialog}
				setOpen={setOpenDetailsDialog}
				productDetails={productDetails}
			/>
		</div>
	);
}

export default ShoppingListing;
