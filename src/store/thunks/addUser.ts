import { createAsyncThunk } from "@reduxjs/toolkit"
import { api } from "../../services/baseUrl"
import { faker } from "@faker-js/faker"
import { v4 as uuidv4 } from "uuid"

const post = createAsyncThunk('users/post', async () => {
  const response = await api.post('/users', {
    name: faker.name.firstName(),
    id: uuidv4()
  })
  return response.data
})

export const postUser = post
