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
import { useState } from "react";
import AdminOrdersDetailsView from "./orders-details";

function AdminOrdersView() {
	const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

	return (
		<Card>
			<CardHeader>
				<CardTitle>All Orders</CardTitle>
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
						<TableRow>
							<TableCell>123456789</TableCell>
							<TableCell>2023-01-01</TableCell>
							<TableCell>Pending</TableCell>
							<TableCell>$100</TableCell>
							<TableCell>
								<Dialog
									open={openDetailsDialog}
									onOpenChange={setOpenDetailsDialog}
								>
									<Button onClick={() => setOpenDetailsDialog(true)}>
										Details
									</Button>
									<AdminOrdersDetailsView />
								</Dialog>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}

export default AdminOrdersView;
