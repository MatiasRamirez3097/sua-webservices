import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "../../Api";

export const getVehicles = createAsyncThunk(
    "vehicles/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await server.get("/vehicles");
            return res.data.response;
        } catch (error) {
            return (
                rejectWithValue(error.response?.data?.message) ||
                "Error al cargar los datos"
            );
        }
    }
);

const vehicleSlice = createSlice({
    name: "vehicles",

    initialState: {
        list: [],
        loading: false,
        error: null,
        successMessage: null,
    },

    reducers: {
        clearMessage: (state) => {
            state.error = null;
            state.successMessage = null;
        },
    },

    extraRecuders: (builder) => {
        builder
            .addCase(getVehicles.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getVehicles.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(getVehicles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearMessage } = vehicleSlice.actions;
export default vehicleSlice.reducer;
