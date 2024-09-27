import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	isLoading: false,
	productReviews: [],
	error: null,
};

export const addReview = createAsyncThunk(
	"review/addReview",
	async (formData, { rejectWithValue }) => {
		try {
			const response = await axios.post(
				"http://localhost:5000/api/shop/review/add",
				formData,
				{ withCredentials: true }
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

export const getReviews = createAsyncThunk(
	"review/getReviews",
	async (id, { rejectWithValue }) => {
		try {
			const response = await axios.get(
				`http://localhost:5000/api/shop/review/${id}`,
				{ withCredentials: true }
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

export const deleteReview = createAsyncThunk(
	"review/deleteReview",
	async (reviewId, { rejectWithValue }) => {
		try {
			const response = await axios.delete(
				`http://localhost:5000/api/shop/review/${reviewId}`,
				{ withCredentials: true }
			);
			return response.data;
		} catch (error) {
			return rejectWithValue(error.response.data);
		}
	}
);

const reviewSlice = createSlice({
	name: "reviewSlice",
	initialState,
	reducers: {
		clearError(state) {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(addReview.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(addReview.fulfilled, (state, action) => {
				state.isLoading = false;
				state.productReviews = action.payload.data;
			})
			.addCase(addReview.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload.message || "Failed to add review";
			})
			.addCase(getReviews.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(getReviews.fulfilled, (state, action) => {
				state.isLoading = false;
				state.productReviews = action.payload.data;
			})
			.addCase(getReviews.rejected, (state) => {
				state.isLoading = false;
				state.productReviews = [];
				state.error = "Failed to fetch reviews";
			})
			.addCase(deleteReview.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(deleteReview.fulfilled, (state, action) => {
				state.isLoading = false;
				state.productReviews = action.payload.data;
			})
			.addCase(deleteReview.rejected, (state) => {
				state.isLoading = false;
				state.error = "Failed to delete review";
			});
	},
});

export const { clearError } = reviewSlice.actions;
export default reviewSlice.reducer;
