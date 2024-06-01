import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  isLoggedIn: false,
  isAdmin: false,
  isGoogleUser: false,
  email: "",
  userName: "",
  userID: "",
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    SET_GOOGLE_USER: (state, action) => {
      state.isGoogleUser = action.payload;
      // console.log('action.payload.admin: ', action.payload);
    },

    SET_ACTIVE_ADMIN: (state, action) => {
      state.isAdmin = action.payload;
    },

    REMOVE_ACTIVE_ADMIN: (state, action) => {
      state.isAdmin = false
    },

    SET_DISPLAY_NAME: (state, action) => {
      state.userName = action.payload
    },

    SET_ACTIVE_USER: (state, action) => {
      state.isLoggedIn = true;
      const { email, userName, userID } = action.payload;
      state.email = email;
      state.userName = userName;
      state.userID = userID;
      // console.log(action.payload);
    },

    REMOVE_ACTIVE_USER: (state, action) => {
      state.isLoggedIn = false;
      state.email = "";
      state.userName = "";
      state.userID = "";
    },
  }
})

export const { SET_GOOGLE_USER, SET_ACTIVE_USER, REMOVE_ACTIVE_USER, SET_ACTIVE_ADMIN, REMOVE_ACTIVE_ADMIN, SET_DISPLAY_NAME } = authSlice.actions
export const selectIsAdmin = (state) => state.auth.isAdmin
export const selectIsLoggedIn = (state) => state.auth.isLoggedIn
export const selectEmail = (state) => state.auth.email
export const selectUserName = (state) => state.auth.userName
export const selectUserID = (state) => state.auth.userID
export default authSlice.reducer
