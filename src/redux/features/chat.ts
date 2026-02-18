import baseApi from "../api/baseApi";


export const chatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrCreateConversation: builder.mutation({
            query: (data) => ({
                url: "/api/v1/chat/conversations",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["RestaurantProfile"],
        }),
        getMessages: builder.query({
            query: ({ conversationId, page = 1, limit = 20 }) =>
                `/api/v1/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`,
            providesTags: ["RestaurantProfile"],
        }),
        sendMessage: builder.mutation({
            query: (data) => ({
                url: "/api/v1/chat/message/customer-to-admin",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["RestaurantProfile"],
        }),
        adminSendMessage: builder.mutation({
            query: (data) => ({
                url: "/api/v1/chat/message/customer-to-admin",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["RestaurantProfile"],
        }),
        adminToProvider: builder.mutation({
            query: (data) => ({
                url: "/api/v1/chat/message/customer-to-admin",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["RestaurantProfile"],
        }),
        getSupportTickets: builder.query({
            query: () => "/api/v1/support/my-tickets",
            providesTags: ["RestaurantProfile"],
        }),
    }),
});

export const {
    useGetOrCreateConversationMutation,
    useGetMessagesQuery,
    useSendMessageMutation,
    useAdminSendMessageMutation,
    useAdminToProviderMutation,
    useGetSupportTicketsQuery
} = chatApi;
