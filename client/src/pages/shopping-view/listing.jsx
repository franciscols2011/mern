import { ArrowUpDownIcon } from "lucide-react";
import { DropdownMenuTrigger } from "/components/ui/dropdown-menu";
import { DropdownMenu } from "/components/ui/dropdown-menu";
import ProductFilter from "/src/components/shopping-view/filter";
import { Button } from "/src/components/ui/button";
import { DropdownMenuContent } from "/components/ui/dropdown-menu";
import { DropdownMenuRadioGroup } from "/components/ui/dropdown-menu";
import { sortOptions } from "/src/config";
import { DropdownMenuRadioItem } from "/components/ui/dropdown-menu";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchAllFilteredProducts } from "/src/store/shop/products-slice";
import ShoppingProductTile from "/src/components/shopping-view/product-tile";
import { createSearchParams, useSearchParams } from "react-router-dom";
import { fetchProductDetails } from "/src/store/shop/products-slice";
import ProductDetailsDialog from "/src/components/shopping-view/product-details";

function createSearchParamsHelper(filterParams) {
	const queryParams = [];

	for (const [key, value] of Object.entries(filterParams)) {
		if (Array.isArray(value) && value.length > 0) {
			const paramValue = value.join(",");

			queryParams.push(`${key}=${paramValue}`);
		}
	}

	return queryParams.join("&");
}

function ShoppingListing() {
	const dispatch = useDispatch();

	const { productList, productDetails } = useSelector(
		(state) => state.shopProducts
	);
	const [filters, setFilters] = useState({});
	const [sort, setSort] = useState(null);
	const [searchParams, setSearchParams] = useSearchParams();
	const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
	function handleSort(value) {
		setSort(value);
	}

	function handleFilter(getSectionId, getCurrentOption) {
		let copyFilters = { ...filters };
		const indexOfCurrentSection =
			Object.keys(copyFilters).indexOf(getSectionId);

		if (indexOfCurrentSection === -1) {
			copyFilters = {
				...copyFilters,
				[getSectionId]: [getCurrentOption],
			};
		} else {
			const indexOfCurrentOption =
				copyFilters[getSectionId].indexOf(getCurrentOption);
			if (indexOfCurrentOption === -1) {
				copyFilters[getSectionId].push(getCurrentOption);
			} else {
				copyFilters[getSectionId].splice(indexOfCurrentOption, 1);
			}
		}
		setFilters(copyFilters);
		sessionStorage.setItem("filters", JSON.stringify(copyFilters));
	}

	function handleGetProductDetails(getCurrentProductId) {
		console.log(getCurrentProductId);
		dispatch(fetchProductDetails(getCurrentProductId));
	}

	useEffect(() => {
		setSort("price-lowtohigh");
		setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
	}, []);

	useEffect(() => {
		if (filters && Object.keys(filters).length > 0) {
			const createQueryString = createSearchParamsHelper(filters);
			setSearchParams(new URLSearchParams(createQueryString));
		}
	}, [filters]);

	useEffect(() => {
		if (filters !== null && sort !== null)
			dispatch(
				fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
			);
	}, [dispatch, sort, filters]);

	useEffect(() => {
		if (productDetails !== null) setOpenDetailsDialog(true);
	}, [productDetails]);

	console.log(productDetails, "ProductDetails");

	return (
		<div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 p-4 md:p-6">
			<ProductFilter filters={filters} handleFilter={handleFilter} />
			<div className="bg-background w-full rounded-lg shadow-sm">
				<div className="p-4 border-b flex items-center justify-between">
					<h2 className="text-lg font-extrabold">Products</h2>
					<div className="flex items-center gap-3">
						<span className="text-muted-foreground">
							{productList?.length} Products
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
							<DropdownMenuContent align="end" className="w-[200px]">
								<DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
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
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
					{productList && productList.length > 0
						? productList.map((productItem) => (
								<ShoppingProductTile
									handleGetProductDetails={handleGetProductDetails}
									product={productItem}
								/>
						  ))
						: null}
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
