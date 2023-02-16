import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/baseUrl";

const fetch = createAsyncThunk('users/fetch', async () => {
  const response = await api.get('/users')
  return response.data
})


export const fetchUser = fetch
