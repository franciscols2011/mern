import { CardFooter } from "/components/ui/card";
import { Label } from "../ui/label";
import { Card, CardContent } from "/components/ui/card";
import { Button } from "../ui/button";
import { Edit, Trash, CheckCircle } from "lucide-react";

function AddressCard({
	addressInfo,
	handleDeleteAddress,
	handleEditAddress,
	setCurrentSelectedAddress,
	selectedId,
}) {
	const isSelected = selectedId === addressInfo._id;

	return (
		<Card
			onClick={
				setCurrentSelectedAddress
					? () => setCurrentSelectedAddress(addressInfo)
					: null
			}
			className={`relative ${
				isSelected ? "bg-gray-100 border border-gray-500" : "bg-white"
			} rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer`}
		>
			{isSelected && (
				<CheckCircle className="absolute top-2 right-2 text-green-500" />
			)}
			<CardContent className={`grid gap-4 p-4`}>
				<div>
					<Label className="font-semibold text-gray-700">Address:</Label>
					<p className="text-gray-600">{addressInfo?.address || "N/A"}</p>
				</div>
				<div>
					<Label className="font-semibold text-gray-700">City:</Label>
					<p className="text-gray-600">{addressInfo?.city || "N/A"}</p>
				</div>
				<div>
					<Label className="font-semibold text-gray-700">Pincode:</Label>
					<p className="text-gray-600">{addressInfo?.pincode || "N/A"}</p>
				</div>
				<div>
					<Label className="font-semibold text-gray-700">Phone:</Label>
					<p className="text-gray-600">{addressInfo?.phone || "N/A"}</p>
				</div>
				{addressInfo?.notes && (
					<div>
						<Label className="font-semibold text-gray-700">Notes:</Label>
						<p className="text-gray-600">{addressInfo?.notes}</p>
					</div>
				)}
			</CardContent>
			<CardFooter className="p-4 flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
				<Button
					variant="solid"
					className="bg-gray-800 text-white hover:bg-gray-700 flex items-center"
					onClick={(e) => {
						e.stopPropagation();
						handleEditAddress(addressInfo);
					}}
				>
					<Edit className="h-4 w-4 mr-2" /> Edit
				</Button>
				<Button
					variant="solid"
					className="bg-red-600 text-white hover:bg-red-700 flex items-center"
					onClick={(e) => {
						e.stopPropagation();
						handleDeleteAddress(addressInfo);
					}}
				>
					<Trash className="h-4 w-4 mr-2" /> Delete
				</Button>
			</CardFooter>
		</Card>
	);
}

export default AddressCard;
