import baseApi from "../api/baseApi";

export const notificationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query({
            query: (params: { page?: number; limit?: number } | void) => {
                const page = params && 'page' in params ? params.page : 1;
                const limit = params && 'limit' in params ? params.limit : 20;
                return {
                    url: `/api/v1/admin/notifications?page=${page}&limit=${limit}`,
                    method: "GET",
                };
            },
            providesTags: ["Notifications"],
        }),
        markAsRead: builder.mutation({
            query: (id) => ({
                url: `/api/v1/admin/notifications/${id}`,
                method: "PATCH",
                body: { isRead: true }
            }),
            invalidatesTags: ["Notifications"],
        }),
        markAllAsRead: builder.mutation({
            query: () => ({
                url: "/api/v1/admin/notifications/mark-all-as-read",
                method: "PATCH",
            }),
            invalidatesTags: ["Notifications"],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useMarkAsReadMutation,
    useMarkAllAsReadMutation,
} = notificationApi;
