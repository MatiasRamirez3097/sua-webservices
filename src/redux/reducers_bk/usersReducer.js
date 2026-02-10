import { createReducer } from "@reduxjs/toolkit";
import {
    authenticate,
    logOut,
    setUser,
    signIn,
    signUp,
    getUsers,
    createUser,
    deleteUser,
    updateUser,
} from "../actions/usersActions";

const initialState = {
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
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user,
                status: "online",
            };
        })

        .addCase(signUp.fulfilled, (state, action) => {
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user,
                status: "online",
            };
        })

        .addCase(authenticate.fulfilled, (state, action) => {
            return {
                ...state,
                user: action.payload.user,
                status: "online",
            };
        })

        .addCase(logOut, (state) => {
            return {
                ...initialState,
                status: "offline",
            };
        })

        .addCase(setUser, (state, action) => {
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                status: action.payload.status,
            };
        })

        .addCase(getUsers.pending, (state) => {
            return {
                ...state,
                loadingUsers: true,
                error: null,
            };
        })

        .addCase(getUsers.fulfilled, (state, action) => {
            return {
                ...state,
                loadingUsers: false,
                users: action.payload,
            };
        })

        .addCase(getUsers.rejected, (state, action) => {
            return {
                ...state,
                loadingUsers: false,
                error: action.error?.message ?? "Error al obtener usuarios",
            };
        })

        .addCase(createUser.pending, (state) => {
            return {
                ...state,
                loadingCreate: true,
                error: null,
            };
        })

        .addCase(createUser.fulfilled, (state, action) => {
            return {
                ...state,
                loadingCreate: false,
                users: [...state.users, action.payload],
            };
        })

        .addCase(createUser.rejected, (state, action) => {
            return {
                ...state,
                loadingCreate: false,
                error: action.payload || "Error al crear usuario",
            };
        })
        .addCase(deleteUser.fulfilled, (state, action) => {
            return {
                ...state,
                users: state.users.filter((u) => u._id !== action.payload),
            };
        })
        .addCase(deleteUser.rejected, (state, action) => {
            return {
                ...state,
                error: action.payload || "No se pudo eliminar el usuario",
            };
        })
        .addCase(updateUser.fulfilled, (state, action) => {
            return {
                ...state,
                users: state.users.map((u) =>
                    u._id === action.payload._id ? action.payload : u
                ),
            };
        })
        .addCase(updateUser.rejected, (state, action) => {
            return {
                ...state,
                error: action.payload || "No se pudo actualizar el usuario",
            };
        })
);

export default usersReducer;
