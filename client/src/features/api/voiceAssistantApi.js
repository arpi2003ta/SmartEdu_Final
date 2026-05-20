import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const VOICE_ASSISTANT_API = (import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/voice-assistant`
  : "http://localhost:8080/api/v1/voice-assistant");

export const voiceAssistantApi = createApi({
  reducerPath: "voiceAssistantApi",
  baseQuery: fetchBaseQuery({
    baseUrl: VOICE_ASSISTANT_API,
    credentials: "include",
  }),

  tagTypes: ["Conversation"],
  endpoints: (builder) => ({
    // Process voice/text query
    processQuery: builder.mutation({
      query: ({ query, queryType = 'text', userId }) => ({
        url: "/query",
        method: "POST",
        body: { query, queryType, userId },
      }),
      invalidatesTags: ["Conversation"],
    }),

    // Public query endpoint (for demo/testing)
    processPublicQuery: builder.mutation({
      query: ({ query, queryType = 'text' }) => ({
        url: "/query-public",
        method: "POST",
        body: { query, queryType },
      }),
    }),

    // Get conversation history
    getConversationHistory: builder.query({
      query: (userId) => ({
        url: `/history/${userId}`,
        method: "GET",
      }),
      providesTags: ["Conversation"],
      transformResponse: (response) => {
        // Transform the response to extract the data
        return response.success ? response.data : { conversations: [] };
      },
    }),
  }),
});

export const {
  useProcessQueryMutation,
  useProcessPublicQueryMutation,
  useGetConversationHistoryQuery,
} = voiceAssistantApi;