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
				return error.response.data; // Retorna el error directamente
			} else if (error.request) {
				return "No se recibió respuesta del servidor.";
			} else {
				return "Error al configurar la solicitud.";
			}
		}
	}
);

export const loginUser = createAsyncThunk("auth/login", async (formData) => {
	try {
		const response = await axios.post(
			"http://localhost:5000/api/auth/login",
			formData,
			{
				withCredentials: true,
			}
		);
		return response.data;
	} catch (error) {
		if (error.response) {
			return error.response.data;
		} else if (error.request) {
			return "No se recibió respuesta del servidor.";
		} else {
			return "Error al configurar la solicitud.";
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
			return error.response.data;
			return "No se recibió respuesta del servidor.";
		} else {
			return "Error al configurar la solicitud.";
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
			return error.response.data;
		} else if (error.request) {
			return "No se recibió respuesta del servidor.";
		} else {
			return "Error al configurar la solicitud.";
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
			.addCase(registerUser.fulfilled, (state, action) => {
				state.isLoading = false;
				if (action.payload.success) {
					state.user = action.payload.user;
					state.isAuthenticated = true;
					state.error = null;
				} else {
					state.error = action.payload;
				}
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.isLoading = false;
				state.user = null;
				state.isAuthenticated = false;
				state.error = action.error.message || "Error al registrar usuario";
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
				state.error = action.error.message || "Error al iniciar sesión";
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
				state.error =
					action.error.message || "Error al verificar autenticación";
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
