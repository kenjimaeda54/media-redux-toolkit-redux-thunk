import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./slice/userSlice";
import { fetchUser } from "./thunks/fetchUser"
import { postUser } from "./thunks/addUser"
import { deleteUser } from "./thunks/removeUsers"
import { albumApi } from "./api/album";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { photoApi } from "./api/photo";

const store = configureStore({
  reducer: {
    users: userReducer,
    //com essa assinatura garanto que o 
    //reducerPath sera o mesmo que colocamos la no api albums
    [albumApi.reducerPath]: albumApi.reducer,
    [photoApi.reducerPath]: photoApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(albumApi.middleware).concat(photoApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',

})

setupListeners(store.dispatch)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>


export { store, fetchUser, postUser, deleteUser };
export { useFetchAlbumQuery, useAddAlbumMutation, useRemoveAlbumMutation, } from "./api/album"
export { useAddPhotoMutation, useFetchPhotoQuery, useRemovePhotoMutation } from "./api/photo"

