import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "../../Api";

const leyendaAction = createAction("leyendaAction", (val) => {
    return {
        payload: val,
    };
});

const fechaResolucionAction = createAction("fechaResolucionAction", (val) => {
    return {
        payload: val,
    };
});

const typeAction = createAction("typeAction", (val) => {
    return {
        payload: val,
    };
});

const postResolucion = createAsyncThunk(
    "postResolucion",
    async (
        { type, date, scheduledFor, data, records },
        { rejectWithValue }
    ) => {
        try {
            const payload = {
                type: type,
                date: date,
                scheduledFor: scheduledFor,
                data: data,
                records: records,
            };
            const res = await server.post(`/resoluciones`, payload);
            return res.data.response;
        } catch (err) {
            const msg = err.response?.data?.detail || "Error desconocido";

            return rejectWithValue({
                sua,
                anio,
                err: msg,
            });
        }
    }
);

export { leyendaAction, postResolucion, fechaResolucionAction, typeAction };
