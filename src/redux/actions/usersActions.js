import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { server } from "../../Api";
import { ls } from "../../utils/ls.js";

export const getUsers = createAsyncThunk(
    "users/getUsers",
    async (_, { rejectWithValue }) => {
        try {
            const token = ls.getText("token");

            const res = await server.get("/users", {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            return res.data.response;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message
            );
        }
    }
);

export const createUser = createAsyncThunk(
    "users/createUser",
    async (userData, { rejectWithValue }) => {
        try {
            const { data } = await server.post("/users/create", userData);
            return {
                ...data.response,
            };
        } catch (error) {
            return rejectWithValue(
                error.response?.data || "Error al crear usuario"
            );
        }
    }
);

const logOut = createAction("logout", () => {
    ls.clear();
    return {
        payload: {
            user: {},
            token: null,
            status: "offline",
        },
    };
});

const setUser = createAction("setUser", ({ user, token }) => {
    return {
        payload: {
            user: user,
            token: token,
            status: "online",
        },
    };
});

const signIn = createAsyncThunk("signIn", async (data) => {
    console.log(data.email);
    const res = await server.post("/auth/signin", {
        email: data.email,
        password: data.password,
    });
    ls.set("token", res.data.token);
    return {
        user: res.data.user ? res.data.user : {},
        token: res.data.token ? res.data.token : null,
        status: "online",
    };
});

const signUp = createAsyncThunk("signUp", async (data) => {
    try {
        const { ...user } = data;
        const res = await server.post("/auth", {
            ...user,
        });
        ls.set("token", res.data.response.token);
        return {
            user: res.data.response.user,
            token: res.data.response.token,
            status: "online",
        };
    } catch (error) {
        return {
            user: {},
            token: null,
            status: "offline",
            error: error.response.data.code,
        };
    }
});

const authenticate = createAsyncThunk("authenticate", async () => {
    const token = ls.getText("token");
    const { data } = await server.get("/auth/token", {
        headers: {
            Authorization: "Bearer " + token,
        },
    });
    return {
        user: data.user,
        status: "online",
    };
});

export const deleteUser = createAsyncThunk(
    "users/deleteUser",
    async (id, thunkAPI) => {
        console.log("➡️ BASE URL:", server.defaults.baseURL);
        console.log("➡️ FULL REQUEST:", `/users/softdelete/${id}`);
        try {
            const token = ls.getText("token");

            const res = await server.put(
                `/users/softdelete/${id}`,
                {},
                {
                    headers: {
                        Authorization: "Bearer " + token,
                    },
                }
            );

            return id;
        } catch (error) {
            console.log("❌ ERROR AL BORRAR:", error);
            return thunkAPI.rejectWithValue(
                error.response?.data || "Error al eliminar usuario"
            );
        }
    }
);

export const updateUser = createAsyncThunk(
    "users/updateUser",
    async ({ id, data }, thunkAPI) => {
        try {
            const res = await server.put(`/users/update/${id}`, data);
            return res.data.response; // Devuelve el usuario actualizado
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data || "Error al actualizar usuario"
            );
        }
    }
);

export { authenticate, logOut, setUser, signIn, signUp };
