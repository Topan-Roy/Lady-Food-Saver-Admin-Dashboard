import { baseApi } from "../api/baseApi";

export const legalApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getLegalDocuments: builder.query({
            query: (params) => {
                const { search, status, page = 1, limit = 5 } = params || {};
                let url = `/api/v1/admin/legal/documents?page=${page}&limit=${limit}`;
                if (search) url += `&search=${search}`;
                if (status) url += `&status=${status}`;
                return url;
            },
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
                    Size: data.Siye || data.Size, // Matching user provided response field 'Size'
                    Siye: data.Siye || data.Size, // Fallback if server expects 'Siye'
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
