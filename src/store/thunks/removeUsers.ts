import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/baseUrl";
import { UsersModel } from "../../types/usersModel"


export const deleteUser = createAsyncThunk('users/deleteuser', async (users: UsersModel) => {
  await api.delete(`/users/${users.id}`)
  //quando não retorna nada da api,ideal e usar o proprio argumento que esta recebendo
  //pois la no momento de criar os builders não receberei nada
  return users
})

