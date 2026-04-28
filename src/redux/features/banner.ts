import baseApi from "../api/baseApi";

export const bannerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBanners: builder.query({
            query: ({ status, page = 1, limit = 10 }) =>
                `/api/v1/admin/banners?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`,
            providesTags: ["Banners"],
        }),
        addBanner: builder.mutation({
            query: (data) => ({
                url: "/api/v1/admin/banners",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Banners"],
        }),
        deleteBanner: builder.mutation({
            query: (id) => ({
                url: `/api/v1/admin/banners/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Banners"],
        }),
        updateBanner: builder.mutation({
            query: ({ id, data }) => ({
                url: `/api/v1/admin/banners/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Banners"],
        }),
    }),
});

export const { useGetBannersQuery, useAddBannerMutation, useDeleteBannerMutation, useUpdateBannerMutation } = bannerApi;
