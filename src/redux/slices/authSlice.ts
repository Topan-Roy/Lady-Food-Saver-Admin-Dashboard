import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    id: string;
    fullName: string;
    email: string;
    role: string;
    isVerified: boolean;
    authProvider: string;
    [key: string]: any;
}

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLogin: (
            state,
            action: PayloadAction<{ user: User; token: string; refreshToken: string }>
        ) => {
            const { user, token, refreshToken } = action.payload;
            state.user = user;
            state.token = token;
            state.refreshToken = refreshToken;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setLogin, logout } = authSlice.actions;

export default authSlice.reducer;
