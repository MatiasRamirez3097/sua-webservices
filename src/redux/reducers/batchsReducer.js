import { createReducer } from "@reduxjs/toolkit";
import {
    fechaResolucionAction,
    getBatchs,
    leyendaAction,
    postResolucion,
    typeAction,
} from "../actions/batchsActions";

const initialState = {
    csvResoluciones: null,
    leyenda: "",
    postStatus: "",
    errores: [],
    fechaResolucion: "",
    type: "RESOLUCION",
    batchs: [],
};

const batchsReducer = createReducer(initialState, (builder) =>
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
        .addCase(typeAction, (state, action) => {
            const newState = { ...state, type: action.payload };
            return newState;
        })
        .addCase(getBatchs.fulfilled, (state, action) => {
            const newState = { ...state, batchs: action.payload };
            return newState;
        })
        .addCase(getBatchs.rejected, (state, action) => {
            const newState = { ...state, batchs: [] };
            return newState;
        })
);

export default batchsReducer;
