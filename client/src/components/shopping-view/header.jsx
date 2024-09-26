import { Sheet, SheetTrigger, SheetContent } from "/components/ui/sheet";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from "/components/ui/dropdown-menu";
import {
	LayoutGrid,
	LogOut,
	Menu,
	ShoppingCart,
	User as UserIcon,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "/src/config";
import { logoutUser } from "/src/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "/src/store/shop/cart-slice";
import { cn } from "/src/lib/utils";
import { Input } from "../ui/input";

function MenuItems() {
	const navigate = useNavigate();

	function handleNavigate(getCurrentMenuItem) {
		const currentFilter =
			getCurrentMenuItem.id !== "home" && getCurrentMenuItem.id !== "products"
				? {
						category: [getCurrentMenuItem.id],
				  }
				: {};

		const params = new URLSearchParams();
		for (const [key, value] of Object.entries(currentFilter)) {
			if (value.length > 0) {
				params.set(key, value.join(","));
			}
		}

		navigate(`${getCurrentMenuItem.path}?${params.toString()}`, {
			replace: true,
		});
	}

	return (
		<nav className="flex flex-col lg:flex-row lg:items-center gap-6">
			{shoppingViewHeaderMenuItems.map((menuItem) => (
				<span
					onClick={() => handleNavigate(menuItem)}
					className="text-lg font-medium cursor-pointer text-gray-800 hover:text-gray-600 transition-colors"
					key={menuItem.id}
				>
					{menuItem.label}
				</span>
			))}
		</nav>
	);
}

function HeaderRightContent() {
	const { user } = useSelector((state) => state.auth);
	const { cartItems } = useSelector((state) => state.shopCart);
	const [openCartSheet, setOpenCartSheet] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	function handleLogout() {
		dispatch(logoutUser());
	}

	useEffect(() => {
		if (user?.id) {
			dispatch(fetchCartItems(user.id));
		}
	}, [dispatch, user?.id]);

	return (
		<div className="flex items-center gap-4">
			<div className="hidden md:flex">
				<Input
					type="text"
					placeholder="Search products..."
					className="w-64 bg-gray-100 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-primary focus:outline-none rounded-full px-4 py-2"
				/>
			</div>
			<Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
				<SheetTrigger asChild>
					<Button variant="ghost" size="icon" className="relative">
						<ShoppingCart className="w-6 h-6 text-gray-800" />
						{cartItems && cartItems.items && cartItems.items.length > 0 && (
							<span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
								{cartItems.items.length}
							</span>
						)}
						<span className="sr-only">Cart</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="right" className="sm:max-w-md">
					<UserCartWrapper
						setOpenCartSheet={setOpenCartSheet}
						cartItems={
							cartItems && cartItems.items && cartItems.items.length > 0
								? cartItems.items
								: []
						}
					/>
				</SheetContent>
			</Sheet>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon" className="relative">
						<UserIcon className="w-6 h-6 text-gray-800" />
						<span className="sr-only">User Menu</span>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					side="bottom"
					align="end"
					className="w-56 bg-white text-gray-800 rounded-md mt-2 shadow-lg"
				>
					<DropdownMenuLabel className="font-semibold text-gray-800">
						Logged in as {user?.userName}
					</DropdownMenuLabel>
					<DropdownMenuSeparator className="bg-gray-200" />
					<DropdownMenuItem
						onClick={() => navigate("/shop/account")}
						className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
					>
						<UserIcon className="h-4 w-4 text-gray-600" />
						<span>Account</span>
					</DropdownMenuItem>
					<DropdownMenuSeparator className="bg-gray-200" />
					<DropdownMenuItem
						onClick={handleLogout}
						className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
					>
						<LogOut className="h-4 w-4 text-gray-600" />
						<span>Logout</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

function ShoppingHeader() {
	return (
		<header className="sticky top-0 z-50 bg-white shadow-lg">
			<div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
				<Link to={"/shop/home"} className="flex items-center gap-2">
					<LayoutGrid className="h-8 w-8 text-primary" />
					<span className="font-extrabold text-2xl text-gray-800">
						Ecommerce
					</span>
				</Link>
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="ghost" size="icon" className="lg:hidden">
							<Menu className="h-6 w-6 text-gray-800" />
							<span className="sr-only">Menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="w-full max-w-xs p-6 bg-white">
						<MenuItems />
						<HeaderRightContent />
					</SheetContent>
				</Sheet>
				<div className="hidden lg:flex items-center gap-8">
					<MenuItems />
				</div>
				<div className="hidden lg:flex items-center gap-4">
					<HeaderRightContent />
				</div>
			</div>
		</header>
	);
}

export default ShoppingHeader;
