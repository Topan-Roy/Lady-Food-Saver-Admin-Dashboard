import { baseApi } from "../api/baseApi";

export interface Violation {
    id: string;
    Listing: string;
    Image: string;
    Restaurant: string;
    Issue: string;
    Keywords: string[];
    Status: string;
    Date: string;
    Severity: string;
}

interface Meta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

interface ComplianceResponse {
    success: boolean;
    data: {
        violations: Violation[];
        meta: Meta;
    };
}

export const complianceApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getViolations: builder.query<ComplianceResponse, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 10 } = {}) => ({
                url: `/api/v1/compliance/violations`,
                params: { page, limit },
            }),
            providesTags: ["Compliance"],
        }),
        takeViolationAction: builder.mutation<any, { id: string; action: "Remove" }>({
            query: ({ id, action }) => ({
                url: `/api/v1/compliance/violations/${id}`,
                method: "PATCH",
                body: { action },
            }),
            invalidatesTags: ["Compliance"],
        }),
    }),
});

export const { useGetViolationsQuery, useTakeViolationActionMutation } = complianceApi;
