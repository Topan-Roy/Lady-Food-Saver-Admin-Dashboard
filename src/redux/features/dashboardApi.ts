import { baseApi } from "../api/baseApi";

export const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            query: (filter) => `/admin/analytics/overview?filter=${filter}`,
            providesTags: ["dashboardStats"],
        }),
        getRevenueStats: builder.query({
            query: (filter) => `/admin/analytics/revenue?filter=${filter}`,
            providesTags: ["earnings-overview"],
        }),
        getOrderStats: builder.query({
            query: (filter) => `/admin/analytics/orders?filter=${filter}`,
            providesTags: ["dashboardStats"],
        }),
        getRecentOrders: builder.query({
            query: () => `/admin/analytics/recent-orders?page=1&limit=5`,
            providesTags: ["dashboardStats"],
        }),
        getActivities: builder.query({
            query: () => `/activities?page=1&limit=10`,
            providesTags: ["dashboardStats"],
        }),
        getTopRestaurants: builder.query({
            query: (filter) => `/admin/dashboard/top-restaurants?filter=${filter || 'month'}`,
            providesTags: ["dashboardStats"],
        }),
        getTrendingMenus: builder.query({
            query: (filter) => `/admin/dashboard/trending-menus?filter=${filter || 'year'}`,
            providesTags: ["dashboardStats"],
        }),
        getRestaurantStats: builder.query({
            query: (restaurantId) => `/admin/dashboard/stats/${restaurantId}`,
        }),
        getRestaurantProfile: builder.query({
            query: (restaurantId) => `/admin/restaurants/${restaurantId}/profile`,
            providesTags: (_result, _error, id) => [{ type: "RestaurantProfile", id }],
        }),
        getRestaurantPickupWindows: builder.query({
            query: (restaurantId) => `/admin/restaurants/${restaurantId}/pickup-windows`,
        }),
        getRestaurantActivitySummary: builder.query({
            query: (restaurantId) => `/admin/dashboard/activity-summary/${restaurantId}`,
        }),
        getRestaurantLocation: builder.query({
            query: (restaurantId) => `/admin/restaurants/${restaurantId}/location`,
        }),
        getRestaurantCompliance: builder.query({
            query: (restaurantId) => `/admin/restaurants/${restaurantId}/compliance`,
        }),
        blockRestaurant: builder.mutation({
            query: (restaurantId) => ({
                url: `/admin/restaurants/${restaurantId}/block`,
                method: 'POST',
            }),
            invalidatesTags: (_result, _error, id) => [{ type: "RestaurantProfile", id }, "dashboardStats"],
        }),
        unblockRestaurant: builder.mutation({
            query: (restaurantId) => ({
                url: `/admin/restaurants/${restaurantId}/unblock`,
                method: 'POST',
            }),
            invalidatesTags: (_result, _error, id) => [{ type: "RestaurantProfile", id }, "dashboardStats"],
        }),
        getRestaurantOrders: builder.query({
            query: (restaurantId) => `/admin/providers/${restaurantId}/orders`,
        }),
        getRestaurantReviews: builder.query({
            query: ({ id, rating, page = 1, limit = 20 }) => {
                let url = `/admin/providers/${id}/reviews?page=${page}&limit=${limit}`;
                if (rating && rating !== 'all') {
                    url += `&rating=${rating}`;
                }
                return url;
            },
        }),
        getGlobalReviews: builder.query({
            query: () => `/admin/reviews?page=1&limit=5`,
            providesTags: ["dashboardStats"],
        }),
        getAllRestaurants: builder.query({
            query: ({ state = 'all_states', status = 'all_status', rating = 'all_ratings', page = 1, limit = 20 }) =>
                `/admin/restaurants?state=${state}&status=${status}&rating=${rating}&page=${page}&limit=${limit}`,
            providesTags: ["dashboardStats"],
        }),
        approveRestaurant: builder.mutation({
            query: (restaurantId) => ({
                url: `/admin/restaurants/${restaurantId}/approve`,
                method: 'POST',
            }),
            invalidatesTags: ["dashboardStats"],
        }),
        rejectRestaurant: builder.mutation({
            query: (restaurantId) => ({
                url: `/admin/restaurants/${restaurantId}/reject`,
                method: 'POST',
            }),
            invalidatesTags: ["dashboardStats"],
        }),
        getCustomers: builder.query({
            query: ({ status = 'all_status', page = 1, limit = 10 }) =>
                `/admin/users/customers?status=${status}&page=${page}&limit=${limit}`,
            providesTags: ["admin-users"],
        }),
        blockCustomer: builder.mutation({
            query: (id) => ({
                url: `/admin/users/${id}/block`,
                method: 'POST',
            }),
            invalidatesTags: ["admin-users"],
        }),
        unblockCustomer: builder.mutation({
            query: (id) => ({
                url: `/admin/users/${id}/unblock`,
                method: 'POST',
            }),
            invalidatesTags: ["admin-users"],
        }),
        getSingleCustomer: builder.query({
            query: (id) => `/admin/users/customers/${id}`,
            providesTags: (_result, _error, id) => [{ type: "admin-users", id }],
        }),
        getTransactionOrders: builder.query({
            query: ({ providerId, status = 'all_status', page = 1, limit = 20 }) =>
                `/admin/transactions-orders/${providerId}?page=${page}&limit=${limit}&status=${status}`,
            providesTags: ["dashboardStats"],
        }),
    }),
});

export const { useGetDashboardStatsQuery, useGetRevenueStatsQuery, useGetOrderStatsQuery, useGetRecentOrdersQuery, useGetActivitiesQuery, useGetTopRestaurantsQuery, useGetTrendingMenusQuery, useGetRestaurantStatsQuery, useGetRestaurantProfileQuery, useGetRestaurantPickupWindowsQuery, useGetRestaurantActivitySummaryQuery, useGetRestaurantLocationQuery, useGetRestaurantComplianceQuery, useBlockRestaurantMutation, useUnblockRestaurantMutation, useGetRestaurantOrdersQuery, useGetRestaurantReviewsQuery, useGetGlobalReviewsQuery, useGetAllRestaurantsQuery, useApproveRestaurantMutation, useRejectRestaurantMutation, useGetCustomersQuery, useBlockCustomerMutation, useUnblockCustomerMutation, useGetSingleCustomerQuery, useGetTransactionOrdersQuery } = dashboardApi;
