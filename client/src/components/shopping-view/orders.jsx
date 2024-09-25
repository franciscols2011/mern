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

import ShoppingOrdersDetailsView from "./orders-details";
import { useEffect, useState } from "react";
import { Dialog } from "/components/ui/dialog";
import { DialogContent } from "../../../components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersByUserId } from "/src/store/shop/order-slice";
import { Badge } from "/components/ui/badge";

function ShoppingOrders() {
	const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const { orderList } = useSelector((state) => state.shopOrder);

	useEffect(() => {
		dispatch(getAllOrdersByUserId(user?.id));
	}, [dispatch]);

	console.log(orderList, "orderList");

	return (
		<Card>
			<CardHeader>
				<CardTitle>Order History</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>ORDER ID</TableHead>
							<TableHead>ORDER DATE</TableHead>
							<TableHead>ORDER STATUS</TableHead>
							<TableHead>ORDER PRICE</TableHead>
							<TableHead>
								<span className="sr-only">Details</span>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{orderList && orderList.length > 0
							? orderList.map((orderItem) => (
									<TableRow>
										<TableCell>{orderItem?._id}</TableCell>
										<TableCell>{orderItem?.orderDate.split("T")[0]}</TableCell>
										<TableCell>
											<Badge
												className={`py-1 px-3 ${
													orderItem?.orderStatus === "pending"
														? "bg-black"
														: "bg-green-500"
												}`}
											>
												{orderItem?.orderStatus}
											</Badge>
										</TableCell>
										<TableCell>{orderItem?.totalAmount}</TableCell>
										<TableCell>
											<Dialog
												open={openDetailsDialog}
												onOpenChange={setOpenDetailsDialog}
											>
												<Button onClick={() => setOpenDetailsDialog(true)}>
													View Details
												</Button>
												<ShoppingOrdersDetailsView />
											</Dialog>
										</TableCell>
									</TableRow>
							  ))
							: null}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

export default ShoppingOrders;
