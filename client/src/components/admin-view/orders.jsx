import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "/components/ui/card";
import { Button } from "../ui/button";
import { Dialog } from "/components/ui/dialog";
import { DialogContent } from "../../../components/ui/dialog";
import AdminOrdersDetailsView from "./orders-details";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	getAllOrdersForAdmin,
	getOrderDetailsForAdmin,
	resetOrderDetails,
} from "/src/store/admin/order-slice";
import { Badge } from "/components/ui/badge";

function AdminOrdersView() {
	const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
	const dispatch = useDispatch();
	const { orderList, orderDetails } = useSelector((state) => state.adminOrder);

	useEffect(() => {
		dispatch(getAllOrdersForAdmin());
	}, [dispatch]);

	useEffect(() => {
		if (orderDetails !== null) setOpenDetailsDialog(true);
	}, [orderDetails]);

	function handleFetchOrderDetails(orderId) {
		dispatch(getOrderDetailsForAdmin(orderId));
	}

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
		<Card className="bg-white rounded-lg shadow-md">
			<CardHeader>
				<CardTitle className="text-2xl font-bold text-gray-800">
					All Orders
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Table className="min-w-full">
					<TableHeader>
						<TableRow className="bg-gray-100">
							<TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								ORDER ID
							</TableHead>
							<TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								ORDER DATE
							</TableHead>
							<TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								ORDER STATUS
							</TableHead>
							<TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
								ORDER PRICE
							</TableHead>
							<TableHead className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
								<span className="sr-only">Details</span>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{orderList && orderList.length > 0 ? (
							orderList.map((orderItem) => (
								<TableRow key={orderItem?._id} className="hover:bg-gray-50">
									<TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
										{orderItem?._id || "N/A"}
									</TableCell>
									<TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
										{orderItem?.orderDate
											? orderItem.orderDate.split("T")[0]
											: "N/A"}
									</TableCell>
									<TableCell className="px-6 py-4 whitespace-nowrap text-sm">
										<Badge
											className={`py-1 px-3 rounded-full font-semibold text-white ${getStatusColor(
												orderItem?.orderStatus
											)}`}
										>
											{orderItem?.orderStatus
												? orderItem.orderStatus.charAt(0).toUpperCase() +
												  orderItem.orderStatus.slice(1)
												: "N/A"}
										</Badge>
									</TableCell>
									<TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
										$
										{typeof orderItem?.totalAmount === "number"
											? orderItem.totalAmount.toFixed(2)
											: "N/A"}
									</TableCell>
									<TableCell className="px-6 py-4 whitespace-nowrap text-center text-sm">
										<Dialog
											open={openDetailsDialog}
											onOpenChange={() => {
												setOpenDetailsDialog(false);
												dispatch(resetOrderDetails());
											}}
										>
											<Button
												variant="solid"
												className="bg-gray-800 text-white hover:bg-gray-700"
												onClick={() => handleFetchOrderDetails(orderItem?._id)}
											>
												View Details
											</Button>
											<DialogContent className="sm:max-w-[700px] p-6 bg-white rounded-lg shadow-lg">
												<AdminOrdersDetailsView orderDetails={orderDetails} />
											</DialogContent>
										</Dialog>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={5}
									className="px-6 py-4 text-center text-sm text-gray-500"
								>
									No orders found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

export default AdminOrdersView;
