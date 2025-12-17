import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  token: localStorage.getItem("token"),
  userType: localStorage.getItem("userType"),
  partyId: localStorage.getItem("partyId"),
  partyName: localStorage.getItem("partyName"),
  isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setCredentials: (state, action) => {
      const { token, userType, partyId, partyName } = action.payload;

      state.token = token;
      state.userType = userType;
      state.partyId = partyId;
      state.partyName = partyName;
      state.isAuthenticated = true;

      localStorage.setItem("token", token);
      localStorage.setItem("userType", userType);
      localStorage.setItem("partyId", partyId);
      localStorage.setItem("partyName", partyName);
    },

    logout: state => {
      state.token = null;
      state.userType = null;
      state.partyId = null;
      state.partyName = null;
      state.isAuthenticated = false;

      // 🔥 Remove ONLY auth keys
      localStorage.removeItem("token");
      localStorage.removeItem("userType");
      localStorage.removeItem("partyId");
      localStorage.removeItem("partyName");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
