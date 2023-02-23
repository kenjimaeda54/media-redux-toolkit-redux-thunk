import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { AlbumModel } from "../../types/albumModel"
import { UsersModel } from "../../types/usersModel"
import { faker } from "@faker-js/faker"


const albumApi = createApi({
  reducerPath: 'albuns',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:7555'
  }),
  tagTypes: ["UserAlbum", "Album"], // precisa colocar o tipo para as tagas poderia criar um enum e colocar 
  endpoints: (builder) => {
    return {
      removeAlbum: builder.mutation({
        //aqui e album model
        invalidatesTags: (results, error, album) => {
          console.log(results, error)
          return [{ type: "Album", id: album.id }] //casso não fizesse a logica com map abaixo precisaria recuperar o userId aqui
        },
        query: (arg: AlbumModel) => {
          return {
            url: `/albums/${arg.id}`,
            method: 'DELETE'
          }

        }
      }),
      addAlbum: builder.mutation({
        //espoco dentro do invalidatesTags esta ligado diratamente ao escopo do query
        //veja que aqui o argumento da query e UsersModel 
        invalidatesTags: (result, error, user) => {
          console.log(result, error)
          return [{ type: "UserAlbum", id: user.id }] //estou usando id para garantir so seja invalidado o a tag correta
        },
        query: (arg: UsersModel) => {
          return {
            url: "/albums",
            body: {
              userId: arg.id,
              title: faker.commerce.productName()
            },
            method: 'POST'
          }
        }
      }),
      //esse nome e oque sera exportado la em baixo
      //retorno e AlbumModel[] e o argumento e UsersModel
      fetchAlbum: builder.query<AlbumModel[], UsersModel>({
        providesTags: (results, error, user) => {
          console.log(error)
          const tags: { type: "UserAlbum" | "Album", id: string }[] = results!.map((it: AlbumModel) => {
            return {

              type: "Album", id: it.id
            }
          }) // aqui vou retornar tag para album 
          tags?.push({ type: "UserAlbum", id: user.id })
          return tags
          //return [{ type: "Album", id: arg.id }] //isso aqui funciona se conseguimos sempre ter acesso ao id 
        },
        query: (arg: UsersModel) => {
          //url que sera requisitada, params e oque vai na url ou seja http://localhost:7555/albums?userId=3
          return {
            url: '/albums',
            params: {
              userId: arg.id
            },
            method: 'GET'
          }
        }
      })
    }
  }
})

//fetchAlbum e o nome inserido la em cima
//redux acresenta query e use para nos
export const { useFetchAlbumQuery, useAddAlbumMutation, useRemoveAlbumMutation } = albumApi
export { albumApi }
