import { createReducer } from "@reduxjs/toolkit";
import { fechaResolucionAction, leyendaAction, postResolucion } from "../actions/resolucionesActions";

const initialState = {
    csvResoluciones: null,
    leyenda: "",
    postStatus: "",
    errores: [],
    fechaResolucion: "",
};

const resolucionesReducer = createReducer(initialState, (builder) =>
    builder
        .addCase(leyendaAction, (state, action) => {
            const newState = { ...state, leyenda: action.payload };
            return newState;
        })
        .addCase(postResolucion.fulfilled, (state, action) => {
            const newState = { ...state, postStatus: action.payload };
            return newState;
        })
        .addCase(postResolucion.rejected, (state, action) => {
            const { anio, sua, err } = action.payload;
            state.errores.push({ anio, sua, err });
        })
        .addCase(fechaResolucionAction, (state, action) => {
            const newState = { ...state, fechaResolucion: action.payload };
            return newState;
        })
);

export default resolucionesReducer;
