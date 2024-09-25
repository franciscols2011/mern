import { useEffect, useState } from "react";
import CommonForm from "../common/form";
import { CardContent } from "/components/ui/card";
import { CardHeader, CardTitle } from "/components/ui/card";
import { Card } from "/components/ui/card";
import { addressFormControls } from "/src/config";
import { useDispatch, useSelector } from "react-redux";
import {
	addNewAddress,
	fetchAllAddress,
	deleteAddress,
	editAddress,
} from "/src/store/shop/address-slice";
import { useToast } from "/src/hooks/use-toast";
import AddressCard from "/src/components/shopping-view/address-card";

const initialAddressFromData = {
	address: "",
	city: "",
	pincode: "",
	phone: "",
	notes: "",
};

function Address({ setCurrentSelectedAddress }) {
	const [formData, setFormData] = useState(initialAddressFromData);
	const [currentEditedId, setCurrentEditedId] = useState(null);
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.auth);
	const { addressList } = useSelector((state) => state.shopAddress);
	const { toast } = useToast();

	const handleManageAddress = (event) => {
		event.preventDefault();

		if (currentEditedId === null && addressList.length >= 3) {
			setFormData(initialAddressFromData);
			toast({
				title: "You can only have 3 addresses",
				variant: "destructive",
			});
			return;
		}

		if (currentEditedId !== null) {
			dispatch(
				editAddress({
					userId: user?.id,
					addressId: currentEditedId,
					formData,
				})
			).then((data) => {
				if (data?.payload?.success) {
					dispatch(fetchAllAddress(user?.id));
					setCurrentEditedId(null);
					setFormData(initialAddressFromData);
					toast({
						title: "Address updated successfully",
					});
				}
			});
		} else {
			dispatch(
				addNewAddress({
					...formData,
					userId: user?.id,
				})
			).then((data) => {
				if (data?.payload?.success) {
					dispatch(fetchAllAddress(user?.id));
					setFormData(initialAddressFromData);
					toast({
						title: "Address added successfully",
					});
				}
			});
		}
	};

	function handleDeleteAddress(getCurrentAddress) {
		dispatch(
			deleteAddress({
				userId: user?.id,
				addressId: getCurrentAddress?._id,
			})
		).then((data) => {
			if (data?.payload?.success) {
				dispatch(fetchAllAddress(user?.id));
				toast({
					title: "Address deleted successfully",
				});
			}
		});
	}

	function handleEditAddress(getCurrentAddress) {
		setCurrentEditedId(getCurrentAddress?._id);
		setFormData({
			...formData,
			address: getCurrentAddress?.address,
			city: getCurrentAddress?.city,
			pincode: getCurrentAddress?.pincode,
			phone: getCurrentAddress?.phone,
			notes: getCurrentAddress?.notes,
		});
	}

	function isFormValid() {
		return Object.keys(formData)
			.map((key) => formData[key].trim() !== "")
			.every((item) => item === true);
	}

	useEffect(() => {
		dispatch(fetchAllAddress(user?.id));
	}, [dispatch]);

	return (
		<Card>
			<div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
				{addressList && addressList.length > 0
					? addressList.map((singleAddressItem) => (
							<AddressCard
								handleDeleteAddress={handleDeleteAddress}
								addressInfo={singleAddressItem}
								handleEditAddress={handleEditAddress}
								setCurrentSelectedAddress={setCurrentSelectedAddress}
							/>
					  ))
					: null}
			</div>
			<CardHeader>
				<CardTitle>
					{currentEditedId !== null ? "Edit Address" : "Add New Address"}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				<CommonForm
					formControls={addressFormControls}
					formData={formData}
					setFormData={setFormData}
					buttonText={currentEditedId !== null ? "Edit" : "Add"}
					onSubmit={handleManageAddress}
					isBtnDisabled={!isFormValid()}
				/>
			</CardContent>
		</Card>
	);
}

export default Address;
