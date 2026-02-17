import { baseApi } from "../api/baseApi";

export const legalApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getLegalDocuments: builder.query({
            query: () => `/api/v1/admin/legal/documents`,
            providesTags: ["LegalDocuments"],
        }),
        deleteLegalDocument: builder.mutation({
            query: (id) => ({
                url: `/api/v1/admin/legal/documents/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["LegalDocuments"],
        }),
        createLegalDocument: builder.mutation({
            query: (data) => ({
                url: `/api/v1/admin/legal/documents`,
                method: 'POST',
                body: {
                    DocumentName: data.DocumentName,
                    Type: data.Type,
                    Siye: data.Siye,
                    fileUrl: data.fileUrl,
                    Status: data.Status
                }
            }),
            invalidatesTags: ["LegalDocuments"],
        }),
    }),
});

export const {
    useGetLegalDocumentsQuery,
    useDeleteLegalDocumentMutation,
    useCreateLegalDocumentMutation
} = legalApi;
