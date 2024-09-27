import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
					className="text-lg font-medium cursor-pointer text-gray-800 hover:text-primary transition-colors relative group"
					key={menuItem.id}
				>
					{menuItem.label}
					<span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></span>
				</span>
			))}
		</nav>
	);
}

function HeaderRightContent({ isMobile }) {
	const { user } = useSelector((state) => state.auth);
	const { cartItems } = useSelector((state) => state.shopCart);
	const [openCartSheet, setOpenCartSheet] = useState(false);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [searchKeyword, setSearchKeyword] = useState("");

	function handleLogout() {
		dispatch(logoutUser());
	}

	function handleSearchSubmit(e) {
		e.preventDefault();
		const trimmedKeyword = searchKeyword.trim();
		if (trimmedKeyword !== "") {
			navigate(`/shop/listing?search=${encodeURIComponent(trimmedKeyword)}`);
			setSearchKeyword("");
		}
	}

	useEffect(() => {
		if (user?.id) {
			dispatch(fetchCartItems(user.id));
		}
	}, [dispatch, user?.id]);

	return (
		<div className="flex items-center gap-4">
			{!isMobile && (
				<div className="hidden md:flex">
					<form
						onSubmit={handleSearchSubmit}
						className="hidden md:flex items-center relative"
					>
						<button
							type="submit"
							className="absolute left-3 text-gray-500 hover:text-primary transition-colors duration-300"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
								/>
							</svg>
						</button>
						<Input
							type="text"
							placeholder="Search products"
							value={searchKeyword}
							onChange={(e) => setSearchKeyword(e.target.value)}
							className="w-64 bg-gray-100 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-primary focus:outline-none rounded-full px-4 py-2 pl-10 transition-all duration-300 ease-in-out transform hover:scale-105"
						/>
						<Button
							type="submit"
							className="ml-2 bg-primary hover:bg-primary-dark text-white rounded-full px-4 py-2 transition-all duration-300 flex items-center shadow-lg transform hover:scale-105"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="h-5 w-5 mr-2"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
								/>
							</svg>
							Search
						</Button>
					</form>
				</div>
			)}
			{isMobile && (
				<form
					onSubmit={handleSearchSubmit}
					className="flex md:hidden items-center relative mt-4"
				>
					<button
						type="submit"
						className="absolute left-3 text-gray-500 hover:text-primary transition-colors duration-300"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
							/>
						</svg>
					</button>
					<Input
						type="text"
						placeholder="Search products"
						value={searchKeyword}
						onChange={(e) => setSearchKeyword(e.target.value)}
						className="w-full bg-gray-100 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-primary focus:outline-none rounded-full px-4 py-2 pl-10 transition-all duration-300 ease-in-out"
					/>
				</form>
			)}
			<Sheet open={openCartSheet} onOpenChange={setOpenCartSheet}>
				<SheetTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="relative hover:bg-gray-200 transition-colors duration-300"
					>
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
					{isMobile && (
						<form
							onSubmit={handleSearchSubmit}
							className="flex md:hidden items-center relative mb-4"
						>
							<button
								type="submit"
								className="absolute left-3 text-gray-500 hover:text-primary transition-colors duration-300"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
									/>
								</svg>
							</button>
							<Input
								type="text"
								placeholder="Search products"
								value={searchKeyword}
								onChange={(e) => setSearchKeyword(e.target.value)}
								className="w-full bg-gray-100 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-primary focus:outline-none rounded-full px-4 py-2 pl-10 transition-all duration-300 ease-in-out"
							/>
						</form>
					)}
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
					<Button
						variant="ghost"
						size="icon"
						className="relative hover:bg-gray-200 transition-colors duration-300"
					>
						<UserIcon className="w-6 h-6 text-gray-800" />
						{user && user.notifications && user.notifications.length > 0 && (
							<span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
								{user.notifications.length}
							</span>
						)}
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
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			const scrollTop = window.scrollY;
			setIsScrolled(scrollTop > 50);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const isMobile = window.innerWidth < 1024;

	return (
		<motion.header
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className={`sticky top-0 z-50 backdrop-blur-md shadow-lg ${
				isScrolled ? "bg-white bg-opacity-90" : "bg-transparent"
			}`}
		>
			<div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
				<Link to={"/shop/home"} className="flex items-center gap-2">
					<LayoutGrid className="h-8 w-8 text-primary" />
					<span className="font-extrabold text-2xl text-gray-800 font-sans">
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
						<HeaderRightContent isMobile={true} />
					</SheetContent>
				</Sheet>
				<div className="hidden lg:flex items-center gap-8">
					<MenuItems />
				</div>
				<div className="hidden lg:flex items-center gap-4">
					<HeaderRightContent isMobile={false} />
				</div>
			</div>
		</motion.header>
	);
}

export default ShoppingHeader;
