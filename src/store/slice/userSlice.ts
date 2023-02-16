import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UsersModel } from "../../types/usersModel";
import { postUser } from "../thunks/addUser";
import { fetchUser } from "../thunks/fetchUser";
import { deleteUser } from "../thunks/removeUsers";


const userSlice = createSlice({
  name: "users",
  initialState: {
    data: [] as UsersModel[],
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers(builder) {

    //pending,fulfilled,rejected e  disponibilizado automatico pelo redux ao criar o redux thunk
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchUser.fulfilled, (state, action: PayloadAction<UsersModel[]>) => {
      state.loading = false
      state.data = action.payload
    })
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as Error & null
    })


    builder.addCase(postUser.pending, (state) => {
      state.loading = true
    })
    builder.addCase(postUser.fulfilled, (state, action: PayloadAction<UsersModel>) => {
      state.loading = false
      state.data.push(action.payload)
    })
    builder.addCase(postUser.rejected, (state) => {
      state.loading = false
    })


    builder.addCase(deleteUser.pending, (state) => {
      state.loading = true
    })
    builder.addCase(deleteUser.fulfilled, (state, action: PayloadAction<UsersModel>) => {
      state.loading = false
      //eu não posso apenas chamar o filter,preciso dizer que o state.data vai ser igual a lista filtrada para atualizar em tempo real
      //apenas modificando ela não ira refletir na ui
      state.data = state.data.filter(it => it.id !== action.payload.id)
    })
    builder.addCase(deleteUser.rejected, (state) => {
      state.loading = false
    })

  }
})

export const userReducer = userSlice.reducer
