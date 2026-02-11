import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "../../../Api.jsx";
import { ls } from "../../../utils/ls.js";

export const getUsers = createAsyncThunk(
    "users/getUsers",
    async (_, { rejectWithValue }) => {
        try {
            const token = ls.getText("token");

            const res = await server.get("/users", {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            console.log(res);
            return res.data.response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

export const createUser = createAsyncThunk(
    "users/createUser",
    async (userData, { rejectWithValue }) => {
        try {
            const { data } = await server.post("/users/create", userData);
            return {
                ...data.response,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Error al crear usuario"
            );
        }
    }
);

export const deleteUser = createAsyncThunk(
    "users/deleteUser",
    async (id, thunkAPI) => {
        console.log("➡️ BASE URL:", server.defaults.baseURL);
        console.log("➡️ FULL REQUEST:", `/users/softdelete/${id}`);
        try {
            const token = ls.getText("token");

            const res = await server.put(
                `/users/softdelete/${id}`,
                {},
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );

            return id;
        } catch (error) {
            console.log("❌ ERROR AL BORRAR:", error);
            return thunkAPI.rejectWithValue(
                error.response?.data || "Error al eliminar usuario"
            );
        }
    }
);

export const updateUser = createAsyncThunk(
    "users/updateUser",
    async ({ id, data }, thunkAPI) => {
        try {
            const res = await server.put(`/users/update/${id}`, data);
            return res.data.response; // Devuelve el usuario actualizado
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Error al actualizar usuario"
            );
        }
    }
);

const userSlice = createSlice({
    name: "users",

    initialState: {
        list: [],
        token: null,
        user: {},
        status: "offline",
        error: null,
        loadingUsers: false,
        loadingCreate: false,
        loading: false,
    },

    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateUser.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = false;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = true;
            });
    },
});

export default userSlice.reducer;
