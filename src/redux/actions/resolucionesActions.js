import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

const leyendaAction = createAction('leyendaAction', (val) => {
    return {
        payload: val
    }
})

export {leyendaAction}