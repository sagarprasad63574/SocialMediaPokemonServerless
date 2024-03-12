import { createSlice } from '@reduxjs/toolkit'
import { registerUser, userLogin } from './authActions'

// initialize userToken from local storage
const userToken = localStorage.getItem('userToken')
    ? localStorage.getItem('userToken')
    : null

const initialState = {
    loading: false,
    userInfo: null,
    userToken,
    error: null,
    success: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('userToken') // delete token from storage
            state.loading = false
            state.userInfo = null
            state.userToken = null
            state.error = null
        },
        setCredentials: (state, { payload }) => {
            state.userInfo = {...payload, userToken}
        },
    },
    extraReducers: (builder) => {
        builder
          .addCase(userLogin.pending, (state, action) => {
            // action is inferred correctly here if using TS
            state.loading = true
            state.error = null
          })
          // You can chain calls, or have separate `builder.addCase()` lines each time
          .addCase(userLogin.fulfilled, (state, {payload}) => {
            state.loading = false
            state.userInfo = payload
            state.userToken = payload.userToken
          })
          .addCase(userLogin.rejected, (state: any, action) => {
            state.loading = false
            state.error = action.payload
          })
          .addCase(registerUser.pending, (state, action) => {
            // action is inferred correctly here if using TS
            state.loading = true
            state.error = null
          })
          // You can chain calls, or have separate `builder.addCase()` lines each time
          .addCase(registerUser.fulfilled, (state: any, action) => {
            state.loading = false
            state.success = true // registration successful
          })
          .addCase(registerUser.rejected, (state: any, {payload}) => {
            state.loading = false
            state.error = payload
          })
          
          // and provide a default case if no other handlers matched
          .addDefaultCase((state, action) => {})
      },
})

export const { logout, setCredentials } = authSlice.actions

export default authSlice.reducer