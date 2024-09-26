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
import { useSearchParams } from "react-router-dom";
import ProductDetailsDialog from "/src/components/shopping-view/product-details";
import { addToCart, fetchCartItems } from "/src/store/shop/cart-slice";
import { useToast } from "/src/hooks/use-toast";

function ShoppingListing() {
	const dispatch = useDispatch();
	const { productList, productDetails } = useSelector(
		(state) => state.shopProducts
	);
	const { user } = useSelector((state) => state.auth);
	const [filters, setFilters] = useState({});
	const [sort, setSort] = useState("price-lowtohigh");
	const [searchParams, setSearchParams] = useSearchParams();
	const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
	const { toast } = useToast();

	function parseSearchParamsToFilters(params) {
		const newFilters = {};
		for (const [key, value] of params.entries()) {
			newFilters[key] = value.split(",");
		}
		return newFilters;
	}

	useEffect(() => {
		const initialFilters = parseSearchParamsToFilters(searchParams);
		setFilters(initialFilters);
	}, []);

	useEffect(() => {
		const newFilters = parseSearchParamsToFilters(searchParams);
		setFilters(newFilters);
	}, [searchParams]);

	useEffect(() => {
		if (filters && sort) {
			dispatch(
				fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
			);
		}
	}, [dispatch, filters, sort]);

	function handleSort(value) {
		setSort(value);
	}

	function handleFilter(sectionId, optionId) {
		const sectionFilters = filters[sectionId] || [];
		const isOptionSelected = sectionFilters.includes(optionId);
		const updatedSectionFilters = isOptionSelected
			? sectionFilters.filter((id) => id !== optionId)
			: [...sectionFilters, optionId];

		const newFilters = {
			...filters,
			[sectionId]: updatedSectionFilters,
		};

		const params = new URLSearchParams();
		for (const [key, value] of Object.entries(newFilters)) {
			if (value.length > 0) {
				params.set(key, value.join(","));
			} else {
				params.delete(key);
			}
		}
		setSearchParams(params);
	}

	function handleGetProductDetails(productId) {
		dispatch(fetchProductDetails(productId));
	}

	function handleAddToCart(productId) {
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
		<div className="flex flex-col md:flex-row gap-6 p-4 md:p-6">
			<div className="w-full md:w-1/4">
				<ProductFilter filters={filters} handleFilter={handleFilter} />
			</div>
			<div className="w-full md:w-3/4">
				<div className="bg-white rounded-lg shadow">
					<div className="p-4 border-b flex items-center justify-between">
						<h2 className="text-xl font-bold text-gray-800">Products</h2>
						<div className="flex items-center gap-3">
							<span className="text-gray-600">
								{productList?.length || 0} Products
							</span>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										className="flex items-center gap-1"
									>
										<ArrowUpDownIcon className="h-4 w-4" />
										<span>Sort by</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-48">
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
					<div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
