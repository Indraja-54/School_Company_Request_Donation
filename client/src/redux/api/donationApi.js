import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const donationApi = createApi({
  reducerPath: "donationApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "/api/donations",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ["Donations", "Requests"],

  endpoints: builder => ({
    // ✅ Company Dashboard
    getCompanyDonations: builder.query({
      query: partyId => `/company/${partyId}`,
      providesTags: ["Donations"],
    }),

    // ✅ Create Donation (with allocation)
    createDonation: builder.mutation({
  query: body => ({
    url: "/",
    method: "POST",
    body,
  }),
  invalidatesTags: ["Donations", "Requests"], // 🔥 REQUIRED
}),


    // ✅ Pending school requests (New Donation page)
    getPendingSchoolRequests: builder.query({
      query: itemType => `/pending-schools/${itemType}`,
      providesTags: ["Requests"],
    }),
    

  }),
});

export const {
  useGetCompanyDonationsQuery,
  useCreateDonationMutation,
  useGetPendingSchoolRequestsQuery,
} = donationApi;
