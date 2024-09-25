import { CardFooter } from "/components/ui/card";
import { Label } from "../ui/label";
import { Card, CardContent } from "/components/ui/card";
import { Button } from "../ui/button";

function AddressCard({
	addressInfo,
	handleDeleteAddress,
	handleEditAddress,
	setCurrentSelectedAddress,
}) {
	return (
		<Card
			onClick={
				setCurrentSelectedAddress
					? () => setCurrentSelectedAddress(addressInfo)
					: null
			}
		>
			<CardContent className="grid p-4 gap-4">
				<Label>Address: {addressInfo?.address}</Label>
				<Label>City: {addressInfo?.city}</Label>
				<Label>Pincode: {addressInfo?.pincode}</Label>
				<Label>Phone: {addressInfo?.phone}</Label>
				<Label>Notes: {addressInfo?.notes}</Label>
			</CardContent>
			<CardFooter className="p-3 flex justify-between">
				<Button onClick={() => handleEditAddress(addressInfo)}>Edit</Button>
				<Button onClick={() => handleDeleteAddress(addressInfo)}>Delete</Button>
			</CardFooter>
		</Card>
	);
}

export default AddressCard;
