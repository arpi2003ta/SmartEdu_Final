import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const ROADMAP_API = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/roadmap`
    : "http://localhost:8080/api/v1/roadmap";

export const roadmapApi = createApi({
    reducerPath: "roadmapApi",
    baseQuery: fetchBaseQuery({
        baseUrl: ROADMAP_API,
        credentials: 'include'
    }),
    tagTypes: ['Roadmap'],
    endpoints: (builder) => ({
        createRoadmap: builder.mutation({
            query: (roadmapData) => ({
                url: "/",
                method: "POST",
                body: roadmapData
            }),
            invalidatesTags: ['Roadmap']
        }),
        getActiveRoadmap: builder.query({
            query: () => ({
                url: "/active",
                method: "GET"
            }),
            providesTags: ['Roadmap']
        }),
        getRoadmapHistory: builder.query({
            query: () => ({
                url: "/history",
                method: "GET"
            }),
            providesTags: ['Roadmap']
        }),
        updateProgress: builder.mutation({
            query: ({ roadmapId, progressData }) => ({
                url: `/${roadmapId}/progress`,
                method: "POST",
                body: progressData
            }),
            invalidatesTags: ['Roadmap']
        }),
        deleteRoadmap: builder.mutation({
            query: (roadmapId) => ({
                url: `/${roadmapId}`,
                method: "DELETE"
            }),
            invalidatesTags: ['Roadmap']
        })
    })
});

export const {
    useCreateRoadmapMutation,
    useGetActiveRoadmapQuery,
    useGetRoadmapHistoryQuery,
    useUpdateProgressMutation,
    useDeleteRoadmapMutation
} = roadmapApi;