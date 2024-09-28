import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	featureImageList: [],
	isLoading: false,
	error: null,
};

export const getFeatureImage = createAsyncThunk(
	"common/getFeatureImage",
	async () => {
		const response = await axios.get(
			"http://localhost:5000/api/common/feature/get"
		);
		return response.data;
	}
);

export const addFeatureImage = createAsyncThunk(
	"common/addFeatureImage",
	async (imageUrl) => {
		const response = await axios.post(
			"http://localhost:5000/api/common/feature/add",
			{ image: imageUrl }
		);
		return response.data;
	}
);

export const deleteFeatureImage = createAsyncThunk(
	"common/deleteFeatureImage",
	async (id) => {
		const response = await axios.delete(
			`http://localhost:5000/api/common/feature/delete/${id}`
		);
		return response.data;
	}
);

const commonSlice = createSlice({
	name: "common",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(addFeatureImage.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(addFeatureImage.fulfilled, (state, action) => {
				state.isLoading = false;
				state.featureImageList = action.payload.data;
			})
			.addCase(addFeatureImage.rejected, (state) => {
				state.isLoading = false;
				state.error = "Failed to add feature image";
			})
			.addCase(getFeatureImage.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getFeatureImage.fulfilled, (state, action) => {
				state.isLoading = false;
				state.featureImageList = action.payload.data;
			})
			.addCase(getFeatureImage.rejected, (state) => {
				state.isLoading = false;
				state.error = "Failed to fetch feature images";
			})
			.addCase(deleteFeatureImage.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteFeatureImage.fulfilled, (state, action) => {
				state.isLoading = false;
				state.featureImageList = state.featureImageList.filter(
					(image) => image._id !== action.payload.data._id
				);
			})
			.addCase(deleteFeatureImage.rejected, (state) => {
				state.isLoading = false;
				state.error = "Failed to delete feature image";
			});
	},
});

export default commonSlice.reducer;
