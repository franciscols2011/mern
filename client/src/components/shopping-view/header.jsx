import { SheetTrigger } from "/components/ui/sheet";
import { Sheet } from "/components/ui/sheet";
import { LayoutGrid, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent } from "/components/ui/sheet";
import { useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "/src/config";

function MenuItems() {
	return (
		<nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
			{shoppingViewHeaderMenuItems.map((menuItem) => (
				<Link
					className="text-sm font-medium"
					key={menuItem.id}
					to={menuItem.path}
				>
					{menuItem.label}
				</Link>
			))}
		</nav>
	);
}

function ShoppingHeader() {
	const { isAuthenticated } = useSelector((state) => state.auth);

	return (
		<header className="sticky top-0 z-40 border-b bg-background">
			<div className="flex h-16 items-center justify-between px-4 md:px-6">
				<Link to={"/shop/home"} className="flex items-center gap-2">
					<LayoutGrid className="h-6 w-6" />
					<span className="font-bold">Ecommerce</span>
				</Link>
				<Sheet>
					<SheetTrigger asChild>
						<Button variant="outline" size="icon" className="lg:hidden">
							<Menu className="h-6 w-6" />
							<span className="sr-only">Menu</span>
						</Button>
					</SheetTrigger>
					<SheetContent side="left" className="w-full max-w-xs">
						<MenuItems />
					</SheetContent>
				</Sheet>
				<div className="hidden lg:block">
					<MenuItems />
				</div>
				{isAuthenticated ? <div></div> : null}
			</div>
		</header>
	);
}

export default ShoppingHeader;
