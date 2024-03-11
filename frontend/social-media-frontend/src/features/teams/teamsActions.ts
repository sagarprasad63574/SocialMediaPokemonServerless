import axios from 'axios'
//import { createAsyncThunk } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux';

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

const getTeams = async (userToken: any) => {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            }
        }
        const { data } = await axios.get(
            `${BASE_URL}/teams`,
            config
        )

            console.log("IAM HERE", data);
        return data; 
    } catch(error) {
        console.log(error);
    }
}

export default getTeams;