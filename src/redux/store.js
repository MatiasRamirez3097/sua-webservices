import { configureStore } from "@reduxjs/toolkit";
import resolucionesReducer from "./reducers/resolucionesReducer";
import usersReducer from "./reducers/usersReducer";

export const store = configureStore({
    reducer: {
        resolucionesReducer,
        usersReducer,
    },
});
