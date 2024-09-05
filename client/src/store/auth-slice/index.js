import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null,  // Añadido para manejar errores
};

export const registerUser = createAsyncThunk(
    'auth/register',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', formData, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                return rejectWithValue(error.response.data);
            } else if (error.request) {
                return rejectWithValue("No se recibió respuesta del servidor.");
            } else {
                return rejectWithValue("Error al configurar la solicitud.");
            }
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', formData, {
                withCredentials: true
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                return rejectWithValue(error.response.data);
            } else if (error.request) {
                return rejectWithValue("No se recibió respuesta del servidor.");
            } else {
                return rejectWithValue("Error al configurar la solicitud.");
            }
        }
    }
);

export const checkAuth = createAsyncThunk(
    'auth/auth/checkauth',
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.get('http://localhost:5000/api/auth/check-auth', {
                withCredentials: true,
                headers: {
                    'Cache-Control' : 'no-store, no-cache, must-revalidate, proxy-revalidate',
                }
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                return rejectWithValue(error.response.data);
            } else if (error.request) {
                return rejectWithValue("No se recibió respuesta del servidor.");
            } else {
                return rejectWithValue("Error al configurar la solicitud.");
            }
        }
    }
);


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload || "Error al registrar usuario";
            })
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log(action);
                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success ? true : false;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload || "Error al iniciar sesión";
            }).addCase(checkAuth.pending, (state) => {

                state.isLoading = true;
                state.error = null;

            }).addCase(checkAuth.fulfilled, (state, action) => {

                state.isLoading = false;
                state.user = action.payload.success ? action.payload.user : null;
                state.isAuthenticated = action.payload.success ? true : false;
                state.error = null;

            }).addCase(checkAuth.rejected, (state, action) => {

                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.error = action.payload || "Error al iniciar sesión";

            });
    }
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
