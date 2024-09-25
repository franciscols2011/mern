import { Sheet, SheetTrigger, SheetContent } from "/components/ui/sheet";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from "/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "/components/ui/avatar";
import {
	LayoutGrid,
	LogOut,
	Menu,
	ShoppingBasket,
	UserRoundCog,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "/src/config";
import { logoutUser } from "/src/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "/src/store/shop/cart-slice";
import { Label } from "../ui/label";

function MenuItems() {
	const navigate = useNavigate();

	function handleNavigate(getCurrentMenuItem) {
		const currentFilter =
			getCurrentMenuItem.id !== "home"
				? {
						category: [getCurrentMenuItem.id],
				  }
				: null;

		sessionStorage.setItem("filters", JSON.stringify(currentFilter));

		navigate(getCurrentMenuItem.path, { replace: true });
		window.location.reload();
	}
	return (
		<nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
			{shoppingViewHeaderMenuItems.map((menuItem) => (
				<Label
					onClick={() => handleNavigate(menuItem)}
					className="text-sm font-medium cursor-pointer text-gray-700 hover:text-gray-900"
					key={menuItem.id}
				>
					{menuItem.label}
				</Label>
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
		<div className="flex lg:items-center lg:flex-row flex-col gap-4">
			<Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
				<SheetTrigger asChild>
					<Button variant="outline" size="icon" className="relative">
						<ShoppingBasket className="w-6 h-6" />
						{cartItems && cartItems.items && cartItems.items.length > 0 && (
							<span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
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
					<Avatar className="bg-gray-800 cursor-pointer hover:bg-gray-700 transition-colors">
						<AvatarFallback className="bg-gray-800 text-white font-extrabold">
							{user?.userName[0].toUpperCase()}
						</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					side="bottom"
					align="end"
					className="w-56 bg-white shadow-lg rounded-md mt-2"
				>
					<DropdownMenuLabel className="font-semibold text-gray-700">
						Logged in as {user?.userName}
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={() => navigate("/shop/account")}
						className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
					>
						<UserRoundCog className="mr-2 h-4 w-4 text-gray-600" />
						<span className="text-gray-700">Account</span>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={handleLogout}
						className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
					>
						<LogOut className="mr-2 h-4 w-4 text-gray-600" />
						<span className="text-gray-700">Logout</span>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

function ShoppingHeader() {
	return (
		<header className="sticky top-0 z-50 border-b bg-white shadow">
			<div className="flex h-16 items-center justify-between px-4 md:px-6">
				<Link to={"/shop/home"} className="flex items-center gap-2">
					<LayoutGrid className="h-6 w-6 text-gray-800" />
					<span className="font-bold text-xl text-gray-800">Ecommerce</span>
				</Link>
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="outline" size="icon" className="lg:hidden">
							<Menu className="h-6 w-6 text-gray-800" />
							<span className="sr-only">Menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="w-full max-w-xs p-6 bg-white">
						<MenuItems />
						<HeaderRightContent />
					</SheetContent>
				</Sheet>
				<div className="hidden lg:flex">
					<MenuItems />
				</div>

				<div className="hidden lg:flex">
					<HeaderRightContent />
				</div>
			</div>
		</header>
	);
}

export default ShoppingHeader;
