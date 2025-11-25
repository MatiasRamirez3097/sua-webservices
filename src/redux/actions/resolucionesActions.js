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

const usuarioResolucionAction = createAction("usuarioResolucionAction", (val) => {
    return {
        payload: val,
    };
});

const postResolucion = createAsyncThunk(
    "postResolucion",
    async ({ sua, anio, leyenda = "" }, { rejectWithValue }) => {
        console.log (anio)
        try {
            const res = await server.post(`/resoluciones`, {
                anio: anio,
                sua: sua,
                fecha: fecha,
                tipo: 1,
                solucion: leyenda,
                usuario: usuario,
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

export { leyendaAction, postResolucion, fechaResolucionAction, usuarioResolucionAction };
