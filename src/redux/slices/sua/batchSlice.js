import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiErrorMessage, server } from "../../../Api";

// El token lo agrega el interceptor de Api.jsx

export const cancelBatch = createAsyncThunk(
    "sua/cancelBatch",
    async (id, { rejectWithValue }) => {
        try {
            const res = await server.patch(`/batches/cancel/${id}`);
            return res.data.response;
        } catch (error) {
            return rejectWithValue(apiErrorMessage(error, "No se pudo cancelar."));
        }
    },
);

export const getBatches = createAsyncThunk(
    "sua/getBatches",
    async (_, { rejectWithValue }) => {
        try {
            const res = await server.get("/batches");
            return res.data.response;
        } catch (error) {
            return rejectWithValue(apiErrorMessage(error));
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
            const res = await server.get(`/batches/getone/${id}`, {
                params: {
                    fields: fields || "",
                    itemsFields: itemsFields || "",
                    onlyErrors,
                },
            });
            return res.data.response;
        } catch (error) {
            return rejectWithValue(apiErrorMessage(error));
        }
    },
);

/**
 * Crea un lote.
 *  - RESOLUCION: { type, idArea, resolutionDate, scheduledFor, legend, records }
 *  - DERIVACION: { type, idAreaDerivada, scheduledFor, legend, records }
 * records: [{ id: "123456" }, ...]
 */
export const postBatches = createAsyncThunk(
    "sua/postBatches",
    async (
        { type, resolutionDate, idArea, idAreaDerivada, scheduledFor, legend, records },
        { rejectWithValue },
    ) => {
        try {
            const payload = {
                type,
                scheduledFor,
                data: { legend },
                records,
            };
            if (type === "RESOLUCION") {
                payload.idArea = Number(idArea);
                payload.date = resolutionDate;
            } else {
                payload.data.idAreaDerivada = Number(idAreaDerivada);
            }
            const res = await server.post(`/batches`, payload);
            return res.data;
        } catch (error) {
            return rejectWithValue(apiErrorMessage(error, "No se pudo crear el lote."));
        }
    },
);

export const rescheduleBatch = createAsyncThunk(
    "rescheduleBatch",
    async ({ id, newDate }, { rejectWithValue }) => {
        try {
            const res = await server.patch(`/batches/reschedule/${id}`, {
                newDate: new Date(newDate).toISOString(),
            });
            return res.data.response;
        } catch (error) {
            return rejectWithValue(apiErrorMessage(error, "No se pudo reprogramar."));
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
            return rejectWithValue(apiErrorMessage(error, "No se pudo eliminar el lote."));
        }
    },
);

const replaceInList = (list, updated) =>
    updated ? list.map((b) => (b._id === updated._id ? updated : b)) : list;

const batchSlice = createSlice({
    name: "batches",
    initialState: {
        batch: {},
        list: [],
        loading: false,
        loadingBatch: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getBatches.pending, (state) => {
                state.loading = true;
            })
            .addCase(getBatches.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload || [];
                state.error = null;
            })
            .addCase(getBatches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getOneBatch.pending, (state) => {
                state.loadingBatch = true;
                state.error = null;
            })
            .addCase(getOneBatch.fulfilled, (state, action) => {
                state.loadingBatch = false;
                state.batch = action.payload || {};
            })
            .addCase(getOneBatch.rejected, (state, action) => {
                state.loadingBatch = false;
                state.error = action.payload;
            })
            .addCase(cancelBatch.fulfilled, (state, action) => {
                state.list = replaceInList(state.list, action.payload);
            })
            .addCase(rescheduleBatch.fulfilled, (state, action) => {
                state.list = replaceInList(state.list, action.payload);
            })
            .addCase(deleteOneBatch.fulfilled, (state, action) => {
                state.list = state.list.filter((b) => b._id !== action.meta.arg);
            });
    },
});

export default batchSlice.reducer;
