import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	isLoading: false,
	searchResults: [],
	searchKeyword: "",
};

export const getSearchResults = createAsyncThunk(
	"search/getSearchProducts",
	async (keyword) => {
		const response = await axios.get(
			`http://localhost:5000/api/shop/search?keyword=${encodeURIComponent(
				keyword
			)}`
		);
		return response.data;
	}
);

const searchSlice = createSlice({
	name: "searchSlice",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getSearchResults.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getSearchResults.fulfilled, (state, action) => {
				state.isLoading = false;
				state.searchResults = action.payload.data;
			})
			.addCase(getSearchResults.rejected, (state) => {
				state.isLoading = false;
				state.searchResults = [];
			});
	},
});

export default searchSlice.reducer;
