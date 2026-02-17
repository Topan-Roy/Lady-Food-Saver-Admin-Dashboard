import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: "/api/v1/auth/login",
                method: "POST",
                body: credentials,
            }),
            invalidatesTags: ["auth"],
        }),
        forgotPassword: builder.mutation({
            query: (data) => ({
                url: "/api/v1/auth/forgot-password",
                method: "POST",
                body: data,
            }),
        }),
        verifyForgotOtp: builder.mutation({
            query: (data) => ({
                url: "/api/v1/auth/verify-forgot-otp",
                method: "POST",
                body: data,
            }),
        }),
        resetPassword: builder.mutation({
            query: ({ token, ...data }) => ({
                url: "/api/v1/auth/reset-password",
                method: "POST",
                body: data,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }),
        }),
    }),
});

export const { useLoginMutation, useForgotPasswordMutation, useVerifyForgotOtpMutation, useResetPasswordMutation } = authApi;
