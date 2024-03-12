import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

export const userLogin: any = createAsyncThunk(
    'auth/login',
    async ({ username, password }: any, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }

            const { data } = await axios.put(
                `${BASE_URL}/users`,
                { username, password },
                config
            )

            localStorage.setItem('userToken', data.userToken)

            return data
        } catch (error: any) {
            if (error.response.data.error) {
                return rejectWithValue(error.response.data.error.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)

export const registerUser: any = createAsyncThunk(
    'auth/register',
    async ({ name, username, password, email }: any, { rejectWithValue }) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            }

            await axios.post(
                `${BASE_URL}/users`,
                { name, username, password, email },
                config
            )
        } catch (error: any) {
            if (error.response.data.error) {
                return rejectWithValue(error.response.data.error.message)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
)