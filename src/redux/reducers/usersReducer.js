import { createReducer } from "@reduxjs/toolkit";
import {
    authenticate,
    logOut,
    setUser,
    signIn,
    signUp,
    getUsers,
    createUser,
} from "../actions/usersActions";

const initialState = {
    countries: [],
    users: [],
    token: null,
    user: {},
    status: "offline",
    error: null,
    loadingUsers: false,
    loadingCreate: false,
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

        .addCase(getUsers.pending, (state) => {
            const newState = {
                ...state,
                loadingUsers: true,
            };

            return newState;
        })
        .addCase(getUsers.fulfilled, (state, action) => {
            const newState = {
                ...state,
                loadingUsers: false,
                users: action.payload,
            };

            return newState;
        })
        .addCase(getUsers.rejected, (state, action) => {
            const newState = {
                ...state,
                loadingUsers: false,
                error: action.error.message,
            };

            return newState;
        })

        .addCase(createUser.pending, (state) => {
            const newState = {
                ...state,
                loadingCreate: true,
                error: null,
            };
            return newState;
        })
        .addCase(createUser.fulfilled, (state, action) => {
            const newState = {
                ...state,
                loadingCreate: false,
                users: [...state.users, action.payload],
            };
            return newState;
        })
        .addCase(createUser.rejected, (state, action) => {
            const newState = {
                ...state,
                loadingCreate: false,
                error: action.payload || "Error al crear usuario",
            };
            return newState;
        })
);

export default usersReducer;
