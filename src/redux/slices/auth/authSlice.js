import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "../../../Api.jsx";
import { ls } from "../../../utils/ls.js";

const tokenFromStorage = ls.getText("token");

export const LOGIN_GENERIC_ERROR = "Usuario o contraseña incorrectos.";

// LOGIN
export const loginUser = createAsyncThunk(
    "auth/login",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const res = await server.post("/auth/signin", { email, password });
            ls.set("token", res.data.token);
            return res.data;
        } catch (error) {
            // Nunca mostramos el motivo exacto (usuario inexistente, contraseña
            // incorrecta, etc.): solo un mensaje genérico.
            const status = error.response?.status;
            if (status === 429) {
                return rejectWithValue(
                    "Demasiados intentos fallidos. Esperá unos minutos e intentá nuevamente.",
                );
            }
            // Solo 400/401 significan credenciales inválidas; cualquier otra
            // respuesta (404 por URL mal configurada, 5xx, sin red) es un
            // problema de conexión y no debe confundirse con una contraseña mala.
            if (status !== 400 && status !== 401) {
                return rejectWithValue(
                    "No se pudo conectar con el servidor. Intentá nuevamente.",
                );
            }
            return rejectWithValue(LOGIN_GENERIC_ERROR);
        }
    },
);

// CARGAR USUARIO A PARTIR DEL TOKEN GUARDADO
export const loadUser = createAsyncThunk(
    "auth/loadUser",
    async (_, { rejectWithValue, getState }) => {
        if (!getState().auth.token) return rejectWithValue(null);
        try {
            const res = await server.get("/auth/token");
            return res.data;
        } catch {
            ls.clear();
            return rejectWithValue("Sesión expirada");
        }
    },
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        token: tokenFromStorage,
        user: {},
        isAuthenticated: !!tokenFromStorage,
        loading: false,
        loggingIn: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            // Conservamos el "recordar usuario" al cerrar sesión
            const remembered = localStorage.getItem("rememberedEmail");
            ls.clear();
            if (remembered) localStorage.setItem("rememberedEmail", remembered);
            state.token = null;
            state.user = {};
            state.isAuthenticated = false;
            state.error = null;
        },
        clearErrors: (state) => {
            state.error = null;
        },
        // Tras cambiar la contraseña el backend emite un token nuevo
        setToken: (state, action) => {
            ls.set("token", action.payload);
            state.token = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loggingIn = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loggingIn = false;
                state.isAuthenticated = true;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loggingIn = false;
                state.error = action.payload || LOGIN_GENERIC_ERROR;
            })
            .addCase(loadUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(loadUser.rejected, (state) => {
                // Sesión inexistente/expirada: volvemos al login sin mostrar error
                state.token = null;
                state.isAuthenticated = false;
                state.loading = false;
            });
    },
});

export const { logout, clearErrors, setToken } = authSlice.actions;
export default authSlice.reducer;
