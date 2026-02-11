import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "../../../Api.jsx";
import { ls } from "../../../utils/ls.js";

const tokenFromStorage = ls.getText("token");

//LOGIN
export const loginUser = createAsyncThunk(
    "auth/login",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const res = await server.post("/auth/signin", {
                email,
                password,
            });

            ls.set("token", res.data.token);
            return res.data;
        } catch (error) {
            console.log(error);
            return rejectWithValue(
                error.response?.data?.message || "Error al iniciar sesion"
            );
        }
    }
);

//CARGAR USUARIO
export const loadUser = createAsyncThunk(
    "auth/loadUser",
    async (_, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;
            const config = {
                headers: { Authorization: `Bearer ${token}` },
            };
            const res = await server.get("/auth/token", config);
            return res.data;
        } catch (error) {
            ls.clear();
            return rejectWithValue("Sesion expirada");
        }
    }
);

const signUp = createAsyncThunk("signUp", async (data) => {
    try {
        const { ...user } = data;
        const res = await server.post("/auth", {
            ...user,
        });
        ls.set("token", res.data.response.token);
        return {
            user: res.data.response.user,
            token: res.data.response.token,
            status: "online",
        };
    } catch (error) {
        return {
            user: {},
            token: null,
            status: "offline",
            error: error.response.data.code,
        };
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: tokenFromStorage,
        user: {},
        isAuthenticated: !!tokenFromStorage,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            ls.clear();
            state.token = null;
            state.user = {};
            state.isAuthenticated = false;
            state.error = null;
        },
        clearErrors: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(loadUser.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(loadUser.rejected, (state, action) => {
                state.error = action.payload;
                state.loading = false;
            });
    },
});

export const { logout, clearErrors } = authSlice.actions;
export default authSlice.reducer;
