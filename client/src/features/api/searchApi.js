import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const SEARCH_API = (import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/search`
  : "http://localhost:8080/api/v1/search");

export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: fetchBaseQuery({
    baseUrl: SEARCH_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    // AI-powered course search
    aiSearchCourses: builder.query({
      query: ({
        query,
        category,
        level,
        minPrice,
        maxPrice,
        sortBy = 'relevance'
      }) => {
        const params = new URLSearchParams();

        if (query) params.append("query", query);
        if (category) params.append("category", category);
        if (level) params.append("level", level);
        if (minPrice) params.append("minPrice", minPrice.toString());
        if (maxPrice) params.append("maxPrice", maxPrice.toString());
        if (sortBy) params.append("sortBy", sortBy);

        return {
          url: `/courses?${params.toString()}`,
          method: "GET",
        };
      },
    }),

    // Auto-complete search suggestions
    getSearchSuggestions: builder.query({
      query: (partialQuery) => ({
        url: `/suggestions?q=${encodeURIComponent(partialQuery)}`,
        method: "GET",
      }),
    }),

    // Search analytics (authenticated)
    getSearchAnalytics: builder.query({
      query: () => ({
        url: "/analytics",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useAiSearchCoursesQuery,
  useGetSearchSuggestionsQuery,
  useGetSearchAnalyticsQuery,
} = searchApi;
