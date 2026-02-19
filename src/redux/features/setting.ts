import baseApi from "../api/baseApi";

export const settingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        updateLogo: builder.mutation({
            query: (data) => ({
                url: "/api/v1/admin/config/logo",
                method: "PATCH",
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
        getPaymentMethods: builder.query({
            query: (params) => ({
                url: "/api/v1/admin/payment-methods",
                params,
            }),
            providesTags: ["paymentMethods"],
        }),
        addPaymentMethod: builder.mutation({
            query: (data) => ({
                url: "/api/v1/admin/payment-methods",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["paymentMethods"],
        }),
        updatePaymentMethod: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/api/v1/admin/payment-methods/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["paymentMethods"],
        }),
        deletePaymentMethod: builder.mutation({
            query: (id) => ({
                url: `/api/v1/admin/payment-methods/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["paymentMethods"],
        }),
        updateUserDistribution: builder.mutation({
            query: (value) => ({
                url: "/api/v1/admin/config/restaurant-dashboard-permissions",
                method: "PATCH",
                body: { showUserDistributionByCity: value },
            }),
            invalidatesTags: ["Config"],
        }),
    }),
});

export const {
    useUpdateLogoMutation,
    useGetPublicConfigQuery,
    useGetPlatformFeeQuery,
    useUpdatePlatformFeeMutation,
    useGetPaymentMethodsQuery,
    useAddPaymentMethodMutation,
    useUpdatePaymentMethodMutation,
    useDeletePaymentMethodMutation,
    useUpdateUserDistributionMutation
} = settingApi;
