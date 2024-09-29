// AuthLayout.jsx
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";

function AuthLayout() {
	return (
		<div className="flex min-h-screen w-full">
			<div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-indigo-700 to-purple-700 w-1/2 px-12">
				<motion.div
					initial={{ opacity: 0, y: -50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 1 }}
					className="max-w-md space-y-6 text-center text-white"
				>
					<motion.h1
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{
							type: "spring",
							stiffness: 100,
							damping: 10,
							delay: 0.5,
						}}
						className="text-4xl font-extrabold tracking-tight"
					>
						Welcome to Ecommerce Shopping
					</motion.h1>
					<motion.p
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 1, delay: 1 }}
						className="text-lg"
					>
						Experience the best online shopping with us.
					</motion.p>
				</motion.div>
			</div>
			<div className="flex flex-1 items-center justify-center bg-gray-100 px-4 py-12 sm:px-6 lg:px-8">
				<Outlet />
			</div>
		</div>
	);
}

export default AuthLayout;
