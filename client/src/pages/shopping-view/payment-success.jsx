import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "/components/ui/card";
import { CheckCircle } from "lucide-react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";

function PaymentSuccessPage() {
	const navigate = useNavigate();
	const { width, height } = useWindowSize();
	const [confetti, setConfetti] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setConfetti(false);
			navigate("/shop/home");
		}, 5000);

		return () => clearTimeout(timer);
	}, [navigate]);

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500 relative">
			{confetti && <Confetti width={width} height={height} />}
			<Card className="max-w-md mx-auto bg-white shadow-lg rounded-xl overflow-hidden animate-fade-in-scale">
				<CardHeader className="flex justify-center p-6">
					<CheckCircle className="h-16 w-16 text-green-500 animate-bounce-slow" />
				</CardHeader>
				<CardContent className="p-6 text-center">
					<CardTitle className="text-2xl font-bold text-gray-800 mb-4">
						Payment Success
					</CardTitle>
					<p className="text-gray-600 mb-6">
						Thank you for your purchase! Your payment was successful and your
						order is being processed.
					</p>
					<div className="mt-4 text-sm text-gray-500">
						You will be redirected to the home page shortly.
					</div>
					<div className="mt-6">
						<button
							onClick={() => navigate("/shop/home")}
							className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
						>
							Go to Home
						</button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export default PaymentSuccessPage;
