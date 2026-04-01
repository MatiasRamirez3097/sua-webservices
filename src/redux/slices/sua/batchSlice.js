import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "../../../Api";
import { ls } from "../../../utils/ls.js";

export const getBatches = createAsyncThunk(
    "sua/getBatches",
    async (_, { rejectWithValue }) => {
        try {
            const token = ls.getText("token");

            const res = await server.get("/batches", {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            console.log(res.data);
            return res.data.response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message,
            );
        }
    },
);

export const getOneBatch = createAsyncThunk(
    "sua/getOneBatch",
    async (
        { id, onlyErrors = false, fields = undefined, itemsFields = undefined },
        { rejectWithValue },
    ) => {
        try {
            const token = ls.getText("token");

            const res = await server.get(`/batches/getone/${id}`, {
                headers: {
                    Authorization: "Bearer " + token,
                },
                params: {
                    fields: fields ? fields : "",
                    itemsFields: itemsFields ? itemsFields : "",
                    onlyErrors: onlyErrors,
                },
            });
            return res.data.response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message,
            );
        }
    },
);

export const postBatches = createAsyncThunk(
    "sua/postBatches",
    async (
        { type, resolutionDate, idArea, scheduledFor, data, records },
        { rejectWithValue },
    ) => {
        try {
            const payload = {
                idArea: idArea,
                type: type,
                date: resolutionDate,
                scheduledFor: scheduledFor,
                data: data,
                records: records,
            };
            const res = await server.post(`/batches`, payload);
            return res.data.response;
        } catch (err) {
            const msg = err.response?.data?.detail || "Error desconocido";

            return rejectWithValue({
                sua,
                anio,
                err: msg,
            });
        }
    },
);

export const rescheduleBatch = createAsyncThunk(
    "rescheduleBatch",
    async ({ id, newDate }, { rejectWithValue }) => {
        alert(newDate);
        try {
            const res = await server.patch(`/batches/reschedule/${id}`, {
                newDate,
            });
            return res.data.response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message,
            );
        }
    },
);

export const deleteOneBatch = createAsyncThunk(
    "sua/deleteOneBatch",
    async (id, { rejectWithValue }) => {
        try {
            const res = await server.delete(`/batches/deleteone/${id}`);
            return res.data.response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message,
            );
        }
    },
);

const batchSlice = createSlice({
    name: "batches",
    initialState: {
        batch: {},
        executionDate: "",
        idArea: 2098,
        legend: "",
        list: [],
        loading: false,
        loadingBatch: false,
        newExecutionDate: "",
        resolutionDate: "",
        type: "RESOLUCION",
    },
    reducers: {
        setExecutionDate: (state, action) => {
            state.executionDate = action.payload;
        },
        setIdArea: (state, action) => {
            state.idArea = action.payload;
        },
        setLegend: (state, action) => {
            state.legend = action.payload;
        },
        setNewExecutionDate: (state, action) => {
            state.newExecutionDate = action.payload;
        },
        setResolutionDate: (state, action) => {
            state.resolutionDate = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBatches.pending, (state) => {
                state.loading = true;
            })
            .addCase(getBatches.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(getBatches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getOneBatch.pending, (state) => {
                state.loadingBatch = true;
                state.error = false;
            })
            .addCase(getOneBatch.fulfilled, (state, action) => {
                state.loading = false;
                state.batch = action.payload;
                state.error = false;
            })
            .addCase(getOneBatch.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    setIdArea,
    setLegend,
    setExecutionDate,
    setNewExecutionDate,
    setResolutionDate,
} = batchSlice.actions;
export default batchSlice.reducer;
