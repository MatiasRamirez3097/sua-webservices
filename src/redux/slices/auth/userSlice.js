import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiErrorMessage, server } from "../../../Api.jsx";

// El token lo agrega el interceptor de Api.jsx

export const getUsers = createAsyncThunk(
    "users/getUsers",
    async (_, { rejectWithValue }) => {
        try {
            const res = await server.get("/users");
            return res.data.response;
        } catch (error) {
            return rejectWithValue(apiErrorMessage(error));
        }
    },
);

export const createUser = createAsyncThunk(
    "users/createUser",
    async (userData, { rejectWithValue }) => {
        try {
            const { data } = await server.post("/users/create", userData);
            if (!data.success) return rejectWithValue(apiErrorMessage({ response: { data } }));
            return data.response;
        } catch (error) {
            return rejectWithValue(apiErrorMessage(error, "Error al crear usuario"));
        }
    },
);

export const deleteUser = createAsyncThunk(
    "users/deleteUser",
    async (id, { rejectWithValue }) => {
        try {
            await server.put(`/users/softdelete/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(apiErrorMessage(error, "Error al eliminar usuario"));
        }
    },
);

export const updateUser = createAsyncThunk(
    "users/updateUser",
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const res = await server.put(`/users/update/${id}`, data);
            if (!res.data.success)
                return rejectWithValue(apiErrorMessage({ response: res }));
            return res.data.response;
        } catch (error) {
            return rejectWithValue(apiErrorMessage(error, "Error al actualizar usuario"));
        }
    },
);

const userSlice = createSlice({
    name: "users",
    initialState: {
        list: [],
        error: null,
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload || [];
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateUser.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.list = state.list.filter((u) => u._id !== action.payload);
            });
    },
});

export default userSlice.reducer;
