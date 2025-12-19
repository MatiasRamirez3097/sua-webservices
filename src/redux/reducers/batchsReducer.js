import { createReducer } from "@reduxjs/toolkit";
import {
    fechaEjecucionAction,
    fechaResolucionAction,
    getBatchs,
    getOneBatch,
    idAreaAction,
    leyendaAction,
    newFechaEjecucionAction,
    postBatchs,
    typeAction,
} from "../actions/batchsActions";

const initialState = {
    csvResoluciones: null,
    idArea: 2098,
    leyenda: "",
    postStatus: "",
    errores: [],
    fechaEjecucion: "",
    fechaResolucion: "",
    newFechaEjecucion: "",
    type: "RESOLUCION",
    batchs: [],
    batch: {},
};

const batchsReducer = createReducer(initialState, (builder) =>
    builder
        .addCase(leyendaAction, (state, action) => {
            const newState = { ...state, leyenda: action.payload };
            return newState;
        })
        .addCase(postBatchs.fulfilled, (state, action) => {
            const newState = { ...state, postStatus: action.payload };
            return newState;
        })
        .addCase(postBatchs.rejected, (state, action) => {
            const { anio, sua, err } = action.payload;
            state.errores.push({ anio, sua, err });
        })
        .addCase(fechaEjecucionAction, (state, action) => {
            const newState = { ...state, fechaEjecucion: action.payload };
            return newState;
        })
        .addCase(fechaResolucionAction, (state, action) => {
            const newState = { ...state, fechaResolucion: action.payload };
            return newState;
        })
        .addCase(idAreaAction, (state, action) => {
            const newState = { ...state, idArea: action.payload };
            return newState;
        })
        .addCase(typeAction, (state, action) => {
            alert(action.payload);
            const newState = { ...state, type: action.payload };
            return newState;
        })
        .addCase(newFechaEjecucionAction, (state, action) => {
            const newState = { ...state, newFechaEjecucion: action.payload };
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
        .addCase(getOneBatch.fulfilled, (state, action) => {
            const newState = { ...state, batch: action.payload };
            console.log(newState);
            return newState;
        })
        .addCase(getOneBatch.rejected, (state, action) => {
            const newState = { ...state, batch: {} };
            return newState;
        })
);

export default batchsReducer;
