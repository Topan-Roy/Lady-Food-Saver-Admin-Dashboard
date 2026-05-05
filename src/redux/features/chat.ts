import baseApi from "../api/baseApi";


export const chatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrCreateConversation: builder.mutation({
            query: (data) => ({
                url: "/api/v1/chat/conversations",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Chat"],
        }),
        getMessages: builder.query({
            query: ({ conversationId, page = 1, limit = 20 }) =>
                `/api/v1/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`,
            providesTags: ["Chat"],
        }),
        sendMessage: builder.mutation({
            query: (data) => ({
                url: "/api/v1/chat/message/customer-to-admin",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Chat"],
        }),
        adminSendMessage: builder.mutation({
            query: (data) => ({
                url: "/api/chat/message/admin-to-customer",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Chat"],
        }),
        adminToProvider: builder.mutation({
            query: (data) => ({
                url: "/api/chat/message/admin-to-provider",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Chat"],
        }),
        getSupportTickets: builder.query({
            query: () => "/api/v1/support/my-tickets",
            providesTags: ["Chat"],
        }),
        getAdminSupportTickets: builder.query({
            query: ({ status = 'Open', priority = 'Medium', page = 1, limit = 10 }) =>
                `/api/v1/support/admin/tickets?status=${status}&priority=${priority}&page=${page}&limit=${limit}`,
            providesTags: ["Chat"],
        }),
    }),
});

export const {
    useGetOrCreateConversationMutation,
    useGetMessagesQuery,
    useSendMessageMutation,
    useAdminSendMessageMutation,
    useAdminToProviderMutation,
    useGetSupportTicketsQuery,
    useGetAdminSupportTicketsQuery
} = chatApi;
