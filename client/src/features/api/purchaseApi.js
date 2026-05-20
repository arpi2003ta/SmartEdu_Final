import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const COURSE_PURCHASE_API = (import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/purchase`
  : "http://localhost:8080/api/v1/purchase");

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: COURSE_PURCHASE_API,
    credentials: "include",
  }),
  tagTypes: ["PurchaseStatus"],
  endpoints: (builder) => ({
    createCheckoutSession: builder.mutation({
      query: (courseId) => ({
        url: "/checkout/create-checkout-session",
        method: "POST",
        body: { courseId },
      }),
    }),
    freeEnroll: builder.mutation({
      query: (courseId) => ({
        url: "/free-enroll",
        method: "POST",
        body: { courseId },
      }),
      // Invalidate the course detail query so "Purchase" → "Continue Course" flips immediately
      invalidatesTags: (_result, _error, courseId) => [
        { type: "PurchaseStatus", id: courseId },
      ],
    }),
    getCourseDetailWithStatus: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}/detail-with-status`,
        method: "GET",
      }),
      providesTags: (_result, _error, courseId) => [
        { type: "PurchaseStatus", id: courseId },
      ],
    }),
    getPurchasedCourses: builder.query({
      query: () => ({
        url: `/`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useCreateCheckoutSessionMutation,
  useFreeEnrollMutation,
  useGetCourseDetailWithStatusQuery,
  useGetPurchasedCoursesQuery,
} = purchaseApi;

