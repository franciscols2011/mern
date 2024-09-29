import CommonForm from "@/components/common/form";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const initialState = {
	identifier: "",
	password: "",
};

function AuthLogin() {
	const [formData, setFormData] = useState(initialState);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { toast } = useToast();

	function handleChange(event) {
		const { name, value } = event.target;
		setFormData({
			...formData,
			[name]: value,
		});
	}

	function onSubmit(event) {
		event.preventDefault();

		dispatch(loginUser(formData)).then((data) => {
			if (data?.payload?.success) {
				toast({
					title: "Logged in successfully",
					variant: "success",
				});
				navigate("/");
			} else {
				toast({
					title: "Invalid username/email or password",
					variant: "destructive",
				});
			}
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
				<h1 className="text-4xl font-extrabold text-gray-900">Welcome Back</h1>
				<p className="mt-2 text-lg text-gray-600">
					Don't have an account?
					<Link
						className="font-semibold ml-2 text-blue-600 hover:text-blue-800 hover:underline"
						to="/auth/register"
					>
						Register
					</Link>
				</p>
			</div>
			<CommonForm
				formControls={loginFormControls}
				buttonText={"Sign In"}
				formData={formData}
				setFormData={setFormData}
				onSubmit={onSubmit}
				onChange={handleChange}
				showErrors={false}
			/>
		</motion.div>
	);
}

export default AuthLogin;
