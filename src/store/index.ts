import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./slice/userSlice";
import { fetchUser } from "./thunks/fetchUser"
import { postUser } from "./thunks/addUser"
import { deleteUser } from "./thunks/removeUsers"

const store = configureStore({
  reducer: {
    users: userReducer
  }
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>


export { store, fetchUser, postUser, deleteUser };
