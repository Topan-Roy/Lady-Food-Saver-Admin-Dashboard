import baseApi from "../api/baseApi";


export const chatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrCreateConversation: builder.mutation({
            query: (data) => ({
                url: "/api/chat/conversations",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["RestaurantProfile"],
        }),
        getMessages: builder.query({
            query: ({ conversationId, page = 1, limit = 20 }) =>
                `/api/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`,
            providesTags: ["RestaurantProfile"],
        }),
        sendMessage: builder.mutation({
            query: (data) => ({
                url: "/api/chat/message/customer-to-admin",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["RestaurantProfile"],
        }),
    }),
});

export const {
    useGetOrCreateConversationMutation,
    useGetMessagesQuery,
    useSendMessageMutation
} = chatApi;
