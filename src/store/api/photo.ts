import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { faker } from "@faker-js/faker"
import { AlbumModel } from "../../types/albumModel";
import { PhotoModel } from "../../types/photoModel";


const photoApi = createApi({
  reducerPath: "photos",
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:7555'
  }),
  tagTypes: ["Photo", "AlbumPhoto"],
  endpoints: (builder) => {
    return {
      removePhoto: builder.mutation({
        invalidatesTags: (results, error, photo) => {
          console.log(results, error)
          return [{ type: "Photo", id: photo.id }]
        },
        query: (arg: PhotoModel) => {
          return {
            url: `/photos/${arg.id}`,
            method: 'DELETE'
          }
        }
      }),
      addPhoto: builder.mutation({
        invalidatesTags: (result, error, album) => {
          console.log(result, error)
          return [{ type: "AlbumPhoto", id: album.id }]
        },
        query: (arg: AlbumModel) => {
          return {
            url: "/photos",
            body: {
              url: faker.image.abstract(100, 100, true),
              albumId: arg.id
            },
            method: "POST"
          }
        },
      }),
      fetchPhoto: builder.query<PhotoModel[], AlbumModel>({
        providesTags: (results, error, album) => {
          console.log(error)
          const tags: { type: "AlbumPhoto" | "Photo", id: string }[] = results!.map(it => {
            return {
              type: "Photo", id: it.id
            }
          })
          tags.push({ type: "AlbumPhoto", id: album.id })

          return tags
        },
        query: (arg: AlbumModel) => {
          return {
            url: "/photos",
            params: {
              albumId: arg.id
            },
            method: 'GET'
          }
        }
      })
    }
  },
})

export { photoApi }
export const { useAddPhotoMutation, useFetchPhotoQuery, useRemovePhotoMutation } = photoApi

