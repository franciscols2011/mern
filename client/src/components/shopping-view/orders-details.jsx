import { DialogContent } from "../../../components/ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../../../components/ui/separator";
import { Badge } from "/components/ui/badge";
import { useSelector } from "react-redux";

function ShoppingOrdersDetailsView({ orderDetails }) {
	const { user } = useSelector((state) => state.auth);

	function getStatusColor(orderStatus) {
		switch (orderStatus) {
			case "pending":
				return "bg-yellow-500";
			case "inProcess":
				return "bg-blue-500";
			case "inShipping":
				return "bg-orange-500";
			case "delivered":
			case "confirmed":
				return "bg-green-500";
			case "rejected":
				return "bg-red-500";
			default:
				return "bg-gray-500";
		}
	}

	return (
		<DialogContent className="sm:max-w-[700px] p-6 bg-white rounded-lg shadow-lg">
			<div className="space-y-6">
				<div className="space-y-4">
					<h2 className="text-2xl font-bold text-gray-800">Order Details</h2>

					<div className="grid grid-cols-2 gap-4">
						<div className="flex justify-between">
							<span className="font-semibold text-gray-700">Order ID:</span>
							<Label className="font-medium text-gray-600">
								{orderDetails?._id || "N/A"}
							</Label>
						</div>

						<div className="flex justify-between">
							<span className="font-semibold text-gray-700">Order Date:</span>
							<Label className="font-medium text-gray-600">
								{orderDetails?.orderDate
									? orderDetails.orderDate.split("T")[0]
									: "N/A"}
							</Label>
						</div>

						<div className="flex justify-between">
							<span className="font-semibold text-gray-700">Order Price:</span>
							<Label className="font-medium text-gray-600">
								$
								{typeof orderDetails?.totalAmount === "number"
									? orderDetails.totalAmount.toFixed(2)
									: "N/A"}
							</Label>
						</div>

						<div className="flex justify-between">
							<span className="font-semibold text-gray-700">
								Payment Method:
							</span>
							<Label className="font-medium text-gray-600">
								{orderDetails?.paymentMethod || "N/A"}
							</Label>
						</div>

						<div className="flex justify-between">
							<span className="font-semibold text-gray-700">
								Payment Status:
							</span>
							<Label className="font-medium text-gray-600">
								{orderDetails?.paymentStatus || "N/A"}
							</Label>
						</div>

						<div className="flex justify-between">
							<span className="font-semibold text-gray-700">Order Status:</span>
							<Label>
								<Badge
									className={`py-1 px-3 rounded-full font-semibold text-white ${getStatusColor(
										orderDetails?.orderStatus
									)}`}
								>
									{orderDetails?.orderStatus
										? orderDetails.orderStatus.charAt(0).toUpperCase() +
										  orderDetails.orderStatus.slice(1)
										: "N/A"}
								</Badge>
							</Label>
						</div>
					</div>
				</div>

				<Separator className="bg-gray-200" />

				<div className="space-y-4">
					<h3 className="text-xl font-bold text-gray-800">Order Items</h3>
					{orderDetails?.cartItems && orderDetails.cartItems.length > 0 ? (
						<table className="w-full table-auto border-collapse">
							<thead>
								<tr className="bg-gray-100">
									<th className="px-4 py-2 text-left font-semibold text-gray-700">
										Product
									</th>
									<th className="px-4 py-2 text-center font-semibold text-gray-700">
										Quantity
									</th>
									<th className="px-4 py-2 text-right font-semibold text-gray-700">
										Price
									</th>
								</tr>
							</thead>
							<tbody>
								{orderDetails.cartItems.map((item) => (
									<tr key={item._id} className="border-b">
										<td className="px-4 py-2 text-gray-600">
											{item.title || "N/A"}
										</td>
										<td className="px-4 py-2 text-center text-gray-600">
											{item.quantity || 0}
										</td>
										<td className="px-4 py-2 text-right text-gray-600">
											${item.price}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					) : (
						<p className="text-gray-600">No products found in this order.</p>
					)}
				</div>

				<Separator className="bg-gray-200" />

				<div className="space-y-4">
					<h3 className="text-xl font-bold text-gray-800">User Information</h3>
					<div className="grid grid-cols-2 gap-4">
						<div className="flex justify-between">
							<span className="font-semibold text-gray-700">Name:</span>
							<span className="font-medium text-gray-600">
								{user.userName || "N/A"}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="font-semibold text-gray-700">Address:</span>
							<span className="font-medium text-gray-600">
								{orderDetails?.addressInfo?.address || "N/A"}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="font-semibold text-gray-700">City:</span>
							<span className="font-medium text-gray-600">
								{orderDetails?.addressInfo?.city || "N/A"}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="font-semibold text-gray-700">Pincode:</span>
							<span className="font-medium text-gray-600">
								{orderDetails?.addressInfo?.pincode || "N/A"}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="font-semibold text-gray-700">Phone:</span>
							<span className="font-medium text-gray-600">
								{orderDetails?.addressInfo?.phone || "N/A"}
							</span>
						</div>
						<div className="flex justify-between">
							<span className="font-semibold text-gray-700">Notes:</span>
							<span className="font-medium text-gray-600">
								{orderDetails?.addressInfo?.notes || "N/A"}
							</span>
						</div>
					</div>
				</div>
			</div>
		</DialogContent>
	);
}

export default ShoppingOrdersDetailsView;
