import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
	isAuthenticated: false,
	isLoading: true,
	user: null,
	error: null,
};

export const registerUser = createAsyncThunk(
	"auth/register",
	async (formData) => {
		try {
			const response = await axios.post(
				"http://localhost:5000/api/auth/register",
				formData,
				{
					withCredentials: true,
				}
			);
			return response.data;
		} catch (error) {
			if (error.response) {
				throw new Error(error.response.data.message || "Registration failed.");
			} else if (error.request) {
				throw new Error("No response received from the server.");
			} else {
				throw new Error("Error setting up the request.");
			}
		}
	}
);

export const loginUser = createAsyncThunk("auth/login", async (formData) => {
	try {
		const response = await axios.post(
			"http://localhost:5000/api/auth/login",
			{
				identifier: formData.identifier,
				password: formData.password,
			},
			{
				withCredentials: true,
			}
		);
		return response.data;
	} catch (error) {
		if (error.response) {
			throw new Error(error.response.data.message || "Login failed.");
		} else if (error.request) {
			throw new Error("No response received from the server.");
		} else {
			throw new Error("Error setting up the request.");
		}
	}
});

export const logoutUser = createAsyncThunk("auth/logout", async () => {
	try {
		const response = await axios.post(
			"http://localhost:5000/api/auth/logout",
			{},
			{
				withCredentials: true,
			}
		);
		return response.data;
	} catch (error) {
		if (error.response) {
			throw new Error(error.response.data.message || "Logout failed.");
		} else if (error.request) {
			throw new Error("No response received from the server.");
		} else {
			throw new Error("Error setting up the request.");
		}
	}
});

export const checkAuth = createAsyncThunk("auth/auth/checkauth", async () => {
	try {
		const response = await axios.get(
			"http://localhost:5000/api/auth/check-auth",
			{
				withCredentials: true,
				headers: {
					"Cache-Control":
						"no-store, no-cache, must-revalidate, proxy-revalidate",
				},
			}
		);
		return response.data;
	} catch (error) {
		if (error.response) {
			throw new Error(error.response.data.message || "Authentication failed.");
		} else if (error.request) {
			throw new Error("No response received from the server.");
		} else {
			throw new Error("Error setting up the request.");
		}
	}
});

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		setUser: (state, action) => {
			state.user = action.payload;
			state.isAuthenticated = true;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(registerUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(registerUser.fulfilled, (state) => {
				state.isLoading = false;
				state.error = null;
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.error.message || "Error registering user";
			})
			.addCase(loginUser.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.isLoading = false;
				if (action.payload.success) {
					state.user = action.payload.user;
					state.isAuthenticated = true;
					state.error = null;
				} else {
					state.error = action.payload;
				}
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.isLoading = false;
				state.user = null;
				state.isAuthenticated = false;
				state.error = action.error.message || "Error logging in";
			})
			.addCase(checkAuth.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(checkAuth.fulfilled, (state, action) => {
				state.isLoading = false;
				if (action.payload.success) {
					state.user = action.payload.user;
					state.isAuthenticated = true;
					state.error = null;
				} else {
					state.error = action.payload;
				}
			})
			.addCase(checkAuth.rejected, (state, action) => {
				state.isLoading = false;
				state.user = null;
				state.isAuthenticated = false;
				state.error = action.error.message || "Error verifying authentication.";
			})
			.addCase(logoutUser.fulfilled, (state) => {
				state.isLoading = false;
				state.user = null;
				state.isAuthenticated = false;
			});
	},
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
