import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const requestApi = createApi({
  reducerPath: "requestApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/requests",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["Requests"],

  endpoints: builder => ({
    getPendingRequests: builder.query({
      query: partyId => `/pending/${partyId}`,
      providesTags: ["Requests"],
    }),

    getProcessedRequests: builder.query({
      query: partyId => `/processed/${partyId}`,
      providesTags: ["Requests"],
    }),

    createRequest: builder.mutation({
      query: body => ({
        url: "/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Requests"],
    }),
    getAvailableDonations: builder.query({
      query: itemType => `/available-donations/${itemType}`,
    }),
  }),
});

export const {
  useGetPendingRequestsQuery,
  useGetProcessedRequestsQuery,
  useCreateRequestMutation,
  useGetAvailableDonationsQuery,
} = requestApi;
