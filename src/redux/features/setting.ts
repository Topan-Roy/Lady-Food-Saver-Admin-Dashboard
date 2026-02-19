import baseApi from "../api/baseApi";

export const settingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        updateLogo: builder.mutation({
            query: (data) => ({
                url: "/api/v1/admin/config/logo",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Config"],
        }),
        getPublicConfig: builder.query({
            query: () => "/api/v1/config/public",
            providesTags: ["Config"],
        }),
        getPlatformFee: builder.query({
            query: () => "/api/v1/config/platform-fee",
            providesTags: ["Config"],
        }),
        updatePlatformFee: builder.mutation({
            query: (data) => ({
                url: "/api/v1/admin/config/platform-fee",
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Config"],
        }),
    }),
});

export const { useUpdateLogoMutation, useGetPublicConfigQuery, useGetPlatformFeeQuery, useUpdatePlatformFeeMutation } = settingApi;
