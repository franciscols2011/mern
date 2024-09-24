const Address = require("../../models/Address");

const addAddress = async (req, res) => {
	try {
		const { userId, address, city, pincode, phone, notes } = req.body;

		if (!userId || !address || !city || !pincode || !phone || !notes) {
			return res.status(400).json({
				success: false,
				message: "Invalid data provided!",
			});
		}

		const newCreatedAddress = new Address({
			userId,
			address,
			city,
			pincode,
			phone,
			notes,
		});

		await newCreatedAddress.save();

		res.status(201).json({
			success: true,
			data: newCreatedAddress,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Some error occured",
		});
	}
};
const fetchAllAddress = async (req, res) => {
	try {
		const { userId } = req.params;
		if (!userId) {
			return res.status(400).json({
				success: false,
				message: " User id is mandatory!",
			});
		}

		const addressList = await Address.find({ userId });

		res.status(200).json({
			success: true,
			data: addressList,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Some error occured",
		});
	}
};
const editAddress = async (req, res) => {
	try {
		const { userId, addressId } = req.params;
		const formData = req.body;

		if (!userId || !addressId) {
			return res.status(400).json({
				success: false,
				message: " User and address id is mandatory!",
			});
		}

		const address = await Address.findOneAndUpdate(
			{
				_id: addressId,
				userId,
			},
			formData,
			{ new: true }
		);

		if (!address) {
			return res.status(404).json({
				success: false,
				message: "Address not found",
			});
		}

		res.status(200).json({
			success: true,
			data: address,
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Some error occured",
		});
	}
};
const deleteAddress = async (req, res) => {
	try {
		const { userId, addressId } = req.params;
		if (!userId || !addressId) {
			return res.status(400).json({
				success: false,
				message: " User and address id is mandatory!",
			});
		}

		const address = await Address.findOneAndDelete({
			_id: addressId,
			userId,
		});

		if (!address) {
			return res.status(404).json({
				success: false,
				message: "Address not found",
			});
		}

		res.status(200).json({
			success: true,
			message: "Address deleted successfully",
		});
	} catch (e) {
		console.log(e);
		res.status(500).json({
			success: false,
			message: "Some error occured",
		});
	}
};

module.exports = { addAddress, fetchAllAddress, editAddress, deleteAddress };
