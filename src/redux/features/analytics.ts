import baseApi from "../api/baseApi";


export const analyticsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCustomerFeedback: builder.query({
            query: (providerId) => `/api/v1/admin/feedback?providerId=${providerId}`,
            providesTags: ["RestaurantProfile"],
        }),
        getTopPerformingRestaurants: builder.query({
            query: ({ page = 1, limit = 5 }) => `/api/v1/admin/top-restaurants?page=${page}&limit=${limit}`,
            providesTags: ["dashboardStats"],
        }),
        getAnalyticsOverview: builder.query({
            query: (providerId) => `/api/v1/admin/analytics?providerId=${providerId}`,
            providesTags: ["dashboardStats", "RestaurantProfile"],
        }),
    }),
});

export const { useGetCustomerFeedbackQuery, useGetTopPerformingRestaurantsQuery, useGetAnalyticsOverviewQuery } = analyticsApi;
