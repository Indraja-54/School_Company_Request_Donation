import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import { authApi } from "./api/authApi";
import {requestApi} from "./api/requestApi";
import {donationApi} from "./api/donationApi"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [requestApi.reducerPath]: requestApi.reducer,
    [donationApi.reducerPath]:donationApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware,requestApi.middleware,donationApi.middleware)
});
