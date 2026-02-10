import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth/authSlice.js";
import batchReducer from "./slices/sua/batchSlice.js";
import userReducer from "./slices/auth/userSlice.js";
/*export const store = configureStore({
    reducer: {
        batchsReducer,
        usersReducer,
    },
});*/

export const store = configureStore({
    reducer: {
        auth: authReducer,
        batches: batchReducer,
        users: userReducer,
    },
});
