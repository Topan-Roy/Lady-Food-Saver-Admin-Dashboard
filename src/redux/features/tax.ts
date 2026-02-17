import { baseApi } from "../api/baseApi";

export const taxApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTaxAnalytics: builder.query({
            query: () => `/api/v1/admin/tax/dashboard`,
            providesTags: ["dashboardStats"],
        }),
        updateTaxRule: builder.mutation({
            query: ({ id, tax, isActive }) => ({
                url: `/api/v1/admin/tax/rules/${id}`,
                method: 'PATCH',
                body: { tax: parseFloat(tax), isActive }
            }),
            invalidatesTags: ["dashboardStats"],
        }),
        deleteTaxRule: builder.mutation({
            query: (id) => ({
                url: `/api/v1/admin/tax/rules/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ["dashboardStats"],
        }),
        createTaxRule: builder.mutation({
            query: (data) => ({
                url: `/api/v1/admin/tax/rules`,
                method: 'POST',
                body: {
                    name: data.name,
                    code: data.code,
                    tax: parseFloat(data.tax),
                    isActive: data.isActive
                }
            }),
            invalidatesTags: ["dashboardStats"],
        }),
    }),
});

export const {
    useGetTaxAnalyticsQuery,
    useUpdateTaxRuleMutation,
    useDeleteTaxRuleMutation,
    useCreateTaxRuleMutation
} = taxApi;
