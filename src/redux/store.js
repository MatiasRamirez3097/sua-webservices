import { configureStore } from "@reduxjs/toolkit";
import batchsReducer from "./reducers/batchsReducer";
import usersReducer from "./reducers/usersReducer";

export const store = configureStore({
    reducer: {
        batchsReducer,
        usersReducer,
    },
});
