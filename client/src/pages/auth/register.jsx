import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const initialState = {
	userName: "",
	email: "",
	confirmEmail: "",
	password: "",
	confirmPassword: "",
};

function AuthRegister() {
	const [formData, setFormData] = useState(initialState);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { toast } = useToast();

	function onSubmit(event) {
		event.preventDefault();

		dispatch(registerUser(formData))
			.unwrap()
			.then((data) => {
				if (data.success) {
					toast({
						title: "User registered successfully!",
						variant: "success",
					});
					navigate("/auth/login");
				}
			})
			.catch((error) => {
				toast({
					title: error || "An error occurred during registration.",
					variant: "destructive",
				});
			});
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
			className="w-full max-w-lg p-10 bg-white bg-opacity-80 backdrop-filter backdrop-blur-md rounded-3xl shadow-xl space-y-8"
		>
			<div className="text-center">
				<h1 className="text-4xl font-extrabold text-gray-900">
					Create New Account
				</h1>
				<p className="mt-2 text-lg text-gray-600">
					Already have an account?
					<Link
						className="font-semibold ml-2 text-blue-600 hover:text-blue-800 hover:underline"
						to="/auth/login"
					>
						Login
					</Link>
				</p>
			</div>
			<CommonForm
				formControls={registerFormControls}
				buttonText={"Sign Up"}
				formData={formData}
				setFormData={setFormData}
				onSubmit={onSubmit}
			/>
		</motion.div>
	);
}

export default AuthRegister;
