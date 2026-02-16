import baseApi from "../api/baseApi";

export const bannerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getBanners: builder.query({
            query: ({ status = 'ACTIVE', page = 1, limit = 10 }) =>
                `/admin/banners?status=${status}&page=${page}&limit=${limit}`,
            providesTags: ["Banners"],
        }),
        addBanner: builder.mutation({
            query: (data) => ({
                url: "/admin/banners",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Banners"],
        }),
        deleteBanner: builder.mutation({
            query: (id) => ({
                url: `/admin/banners/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Banners"],
        }),
        updateBanner: builder.mutation({
            query: ({ id, data }) => ({
                url: `/admin/banners/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Banners"],
        }),
    }),
});

export const { useGetBannersQuery, useAddBannerMutation, useDeleteBannerMutation, useUpdateBannerMutation } = bannerApi;
