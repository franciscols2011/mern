import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	isLoading: false,
	addressList: [],
};

export const addNewAddress = createAsyncThunk(
	"/address/addNewAddress",
	async (formData) => {
		const response = await axios.post(
			"http://localhost:5000/api/shop/address/add",
			formData
		);
		return response.data;
	}
);

export const fetchAllAddress = createAsyncThunk(
	"/address/fetchAllAddress",
	async (userId) => {
		const response = await axios.get(
			`http://localhost:5000/api/shop/address/get/${userId}`
		);
		return response.data;
	}
);

export const editAddress = createAsyncThunk(
	"/address/editAddress",
	async ({ userId, addressId, formData }) => {
		const response = await axios.put(
			`http://localhost:5000/api/shop/address/update/${userId}/${addressId}`,
			formData
		);
		return response.data;
	}
);

export const deleteAddress = createAsyncThunk(
	"/address/deleteAddress",
	async ({ userId, addressId }) => {
		const response = await axios.delete(
			`http://localhost:5000/api/shop/address/delete/${userId}/${addressId}`
		);
		return response.data;
	}
);

const addressSlice = createSlice({
	name: "address",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(addNewAddress.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(addNewAddress.fulfilled, (state, action) => {
				state.isLoading = false;

				state.addressList.push(action.payload.data);
			})
			.addCase(addNewAddress.rejected, (state) => {
				state.isLoading = false;
			})
			.addCase(fetchAllAddress.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchAllAddress.fulfilled, (state, action) => {
				state.isLoading = false;

				if (action.payload && action.payload.data) {
					state.addressList = action.payload.data;
				} else {
					state.addressList = [];
				}
			})
			.addCase(fetchAllAddress.rejected, (state) => {
				state.isLoading = false;
				state.addressList = [];
			})
			.addCase(editAddress.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(editAddress.fulfilled, (state, action) => {
				state.isLoading = false;
				const updatedAddress = action.payload.data;
				state.addressList = state.addressList.map((address) =>
					address.id === updatedAddress.id ? updatedAddress : address
				);
			})
			.addCase(editAddress.rejected, (state) => {
				state.isLoading = false;
			})
			.addCase(deleteAddress.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteAddress.fulfilled, (state, action) => {
				state.isLoading = false;

				if (action.payload && action.payload.data) {
					const deletedAddressId = action.payload.data.id;

					state.addressList = state.addressList.filter(
						(address) => address.id !== deletedAddressId
					);
				}
			})
			.addCase(deleteAddress.rejected, (state) => {
				state.isLoading = false;
			});
	},
});

export default addressSlice.reducer;
