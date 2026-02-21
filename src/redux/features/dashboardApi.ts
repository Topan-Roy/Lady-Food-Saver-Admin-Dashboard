import { baseApi } from "../api/baseApi";

export const dashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            query: (filter) => `/api/v1/admin/analytics/overview?filter=${filter}`,
            providesTags: ["dashboardStats"],
        }),
        getRevenueStats: builder.query({
            query: (filter) => `/api/v1/admin/analytics/revenue?filter=${filter}`,
            providesTags: ["earnings-overview"],
        }),
        getOrderStats: builder.query({
            query: (filter) => `/api/v1/admin/analytics/orders?filter=${filter}`,
            providesTags: ["dashboardStats"],
        }),
        getRecentOrders: builder.query({
            query: () => `/api/v1/admin/analytics/recent-orders?page=1&limit=5`,
            providesTags: ["dashboardStats"],
        }),
        getActivities: builder.query({
            query: () => `/api/v1/activities?page=1&limit=10`,
            providesTags: ["dashboardStats"],
        }),
        getTopRestaurants: builder.query({
            query: (filter) => `/api/v1/admin/dashboard/top-restaurants?filter=${filter || 'month'}`,
            providesTags: ["dashboardStats"],
        }),
        getTrendingMenus: builder.query({
            query: (filter) => `/api/v1/admin/dashboard/trending-menus?filter=${filter || 'year'}`,
            providesTags: ["dashboardStats"],
        }),
        getRestaurantStats: builder.query({
            query: (restaurantId) => `/admin/dashboard/stats/${restaurantId}`,
        }),
        getRestaurantProfile: builder.query({
            query: (restaurantId) => `/api/v1/admin/restaurants/${restaurantId}/profile`,
            providesTags: (_result, _error, id) => [{ type: "RestaurantProfile", id }],
        }),
        getRestaurantPickupWindows: builder.query({
            query: (restaurantId) => `/api/v1/admin/restaurants/${restaurantId}/pickup-windows`,
        }),
        getRestaurantActivitySummary: builder.query({
            query: (restaurantId) => `/api/v1/admin/dashboard/activity-summary/${restaurantId}`,
        }),
        getRestaurantLocation: builder.query({
            query: (restaurantId) => `/api/v1/admin/restaurants/${restaurantId}/location`,
        }),
        getRestaurantCompliance: builder.query({
            query: (restaurantId) => `/api/v1/admin/restaurants/${restaurantId}/compliance`,
        }),
        blockRestaurant: builder.mutation({
            query: (restaurantId) => ({
                url: `/api/v1/admin/restaurants/${restaurantId}/block`,
                method: 'POST',
                body: {},
            }),
            invalidatesTags: (_result, _error, id) => [{ type: "RestaurantProfile", id }, "dashboardStats"],
        }),
        unblockRestaurant: builder.mutation({
            query: (restaurantId) => ({
                url: `/api/v1/admin/restaurants/${restaurantId}/unblock`,
                method: 'POST',
                body: {},
            }),
            invalidatesTags: (_result, _error, id) => [{ type: "RestaurantProfile", id }, "dashboardStats"],
        }),
        getRestaurantOrders: builder.query({
            query: (restaurantId) => `/api/v1/admin/providers/${restaurantId}/orders`,
        }),
        getRestaurantReviews: builder.query({
            query: ({ id, rating, page = 1, limit = 20 }) => {
                let url = `/api/v1/admin/providers/${id}/reviews?page=${page}&limit=${limit}`;
                if (rating && rating !== 'all') {
                    url += `&rating=${rating}`;
                }
                return url;
            },
        }),
        getGlobalReviews: builder.query({
            query: () => `/api/v1/admin/reviews?page=1&limit=5`,
            providesTags: ["dashboardStats"],
        }),
        getAllRestaurants: builder.query({
            query: ({ state = 'all_states', status = 'all_status', rating = 'all_ratings', page = 1, limit = 20 }) =>
                `/api/v1/admin/restaurants?state=${state}&status=${status}&rating=${rating}&page=${page}&limit=${limit}`,
            providesTags: ["dashboardStats"],
        }),
        approveRestaurant: builder.mutation({
            query: (restaurantId) => ({
                url: `/api/v1/admin/restaurants/${restaurantId}/approve`,
                method: 'POST',
            }),
            invalidatesTags: ["dashboardStats"],
        }),
        rejectRestaurant: builder.mutation({
            query: (restaurantId) => ({
                url: `/api/v1/admin/restaurants/${restaurantId}/reject`,
                method: 'POST',
            }),
            invalidatesTags: ["dashboardStats"],
        }),
        getCustomers: builder.query({
            query: ({ page = 1, limit = 10 }) =>
                `/api/v1/admin/customers/dashboard/customersAll?page=${page}&limit=${limit}`,
            providesTags: ["admin-users"],
        }),
        blockCustomer: builder.mutation({
            query: (id) => ({
                url: `/api/v1/admin/restaurants/${id}/block`,
                method: 'POST',
                body: {},
            }),
            invalidatesTags: ["admin-users"],
        }),
        unblockCustomer: builder.mutation({
            query: (id) => ({
                url: `/api/v1/admin/restaurants/${id}/unblock`,
                method: 'POST',
                body: {},
            }),
            invalidatesTags: ["admin-users"],
        }),
        getSingleCustomer: builder.query({
            query: (id) => `/api/v1/admin/customers/dashboard/${id}?page=1&limit=10`,
            providesTags: (_result, _error, id) => [{ type: "admin-users", id }],
        }),
        getCustomerProfile: builder.query({
            query: (id) => `/api/v1/admin/customers/dashboard/admin/${id}/profile`,
            providesTags: (_result, _error, id) => [{ type: "admin-users", id }],
        }),
        getTransactionOrders: builder.query({
            query: ({ providerId, status = 'all_status', page = 1, limit = 20, timeFilter, startDate, endDate }) => {
                let url = `/api/v1/admin/transactions-orders/${providerId ? providerId : ''}?page=${page}&limit=${limit}&status=${status}`;
                if (timeFilter && timeFilter !== 'all_time' && timeFilter !== 'custom') {
                    url += `&filter=${timeFilter}`;
                }
                if (startDate) {
                    url += `&startDate=${startDate}`;
                }
                if (endDate) {
                    url += `&endDate=${endDate}`;
                }
                return url;
            },
            providesTags: ["dashboardStats"],
        }),
        getOrderDetails: builder.query({
            query: (orderId) => `/api/v1/admin/orders/${orderId}`,
            providesTags: (_result, _error, id) => [{ type: "dashboardStats", id }],
        }),
    }),
});

export const { useGetDashboardStatsQuery, useGetRevenueStatsQuery, useGetOrderStatsQuery, useGetRecentOrdersQuery, useGetActivitiesQuery, useGetTopRestaurantsQuery, useGetTrendingMenusQuery, useGetRestaurantStatsQuery, useGetRestaurantProfileQuery, useGetRestaurantPickupWindowsQuery, useGetRestaurantActivitySummaryQuery, useGetRestaurantLocationQuery, useGetRestaurantComplianceQuery, useBlockRestaurantMutation, useUnblockRestaurantMutation, useGetRestaurantOrdersQuery, useGetRestaurantReviewsQuery, useGetGlobalReviewsQuery, useGetAllRestaurantsQuery, useApproveRestaurantMutation, useRejectRestaurantMutation, useGetCustomersQuery, useBlockCustomerMutation, useUnblockCustomerMutation, useGetSingleCustomerQuery, useGetCustomerProfileQuery, useGetTransactionOrdersQuery, useGetOrderDetailsQuery } = dashboardApi;
