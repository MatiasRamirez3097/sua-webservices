import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "../../Api";

const leyendaAction = createAction("leyendaAction", (val) => {
    return {
        payload: val,
    };
});

const postResolucion = createAsyncThunk(
    "postResolucion",
    async ({ sua, anio, leyenda = "" }, { rejectWithValue }) => {
        try {
            const res = await server.post(`/resoluciones`, {
                anio: anio,
                sua: sua,
                fecha: "15/11/2025 07:00:00",
                tipo: 1,
                solucion: leyenda,
                usuario: "mramire7",
                id_motivo_cierre: 0,
                image: "",
            });
            return res.data.response;
        } catch (err) {
            console.log(err.response.data.detail);
            const msg = err.response?.data?.detail || "Error desconocido";

            console.log("Error:", msg);

            return rejectWithValue({
                sua,
                anio,
                err: msg,
            });
        }
    }
);

export { leyendaAction, postResolucion };
