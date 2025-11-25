import { createReducer } from "@reduxjs/toolkit";
import {
    authenticate,
    logOut,
    setUser,
    signIn,
    signUp,
} from "../actions/usersActions";

const initialState = {
    countries: [],
    token: null,
    user: {},
    status: "offline",
    error: null,
};

const usersReducer = createReducer(initialState, (builder) =>
    builder
        .addCase(signIn.fulfilled, (state, action) => {
            const newState = { ...state, ...action.payload };
            return newState;
        })
        .addCase(signUp.fulfilled, (state, action) => {
            const newState = { ...state, ...action.payload };
            return newState;
        })
        .addCase(signUp.rejected, (state, action) => {
            console.log(action.payload);
            const newState = { ...state, ...action.payload };
            return newState;
        })
        .addCase(authenticate.fulfilled, (state, action) => {
            const newState = { ...state, ...action.payload };
            return newState;
        })
        .addCase(logOut, (state, action) => {
            const newState = { ...state, ...action.payload };
            return newState;
        })
        .addCase(setUser, (state, action) => {
            console.log(action.payload);
            const newState = {
                ...state,
                users: action.payload.user,
                token: action.payload.token,
                status: action.payload.status,
            };
            return newState;
        })
);

export default usersReducer;
