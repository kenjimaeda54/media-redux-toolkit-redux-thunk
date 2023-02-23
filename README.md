# Media
Pequena aplicação com possibilidade de inserir nome do usuário,seu playList e imagem da playlist

## Motivação 
Entender do uso de Redux Thunks e Redux Toolkit Query


## Feature
- Para usar o thunk melhor estrategia e retornar o valor da API dentro da constante que esta instanciando o asynThunk
- Quando não retorna nada da API o ideal e retornar o valor que estamos recebendo como argumento
- Motivo de fazer isso porque precisamos no momento de criar os builders o argumento no action.payload
- Abaixo um exemplo do uso de thunks



```typescript
// criamos nossos thunk
import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/baseUrl";

const fetch = createAsyncThunk('users/fetch', async () => {
  const response = await api.get('/users')
  return response.data
})


export const fetchUser = fetch


// dentro de slicers no extra reducer adiconamos a logica
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

    
  }
})

export const userReducer = userSlice.reducer

// store.js

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



//depois e so fazer o dispatch

import {fetchUser} from "./store

const disptach = useDispatch()

useEffect(() =>{
 dispatch(fetchUser())
},[])



```

## 
- Para facilitar o uso de thunk criei um hook
- Quando desejamos pegar o retorno da promise do thunk usamos o unwrap
- Sem ele possivelmente ira falhar se tentar pegar o retorno da promise apos ela ser concluída

```typescript
import { useState } from "react"
import { useDispatch } from "react-redux";
import { UsersModel } from "../types/usersModel";




export const useThunk = (action: any): [(data?: UsersModel) => void, boolean, Error | null] => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const dispatch = useDispatch()

  const asyncThunk = (data?: UsersModel) => {
    setIsLoading(true)
    //https://redux-toolkit.js.org/api/createAsyncThunk
    //unwrap  consigo capturar o retorno da promisse dentro de outra
    //não posso tentar resolver usando then normalmente ira falhar
    dispatch(action(data))
      .unwrap()
      .catch((error: Error) => setError(error))
      .finally(() => setIsLoading(false))
  }


  return [asyncThunk, isLoading, error]

}


// depois e so chamar nossa hook
import { useEffect } from "react"
import { Skeleton, Button, Text, Stack, Accordion, HStack, Spinner } from '@chakra-ui/react'
import { useSelector } from "react-redux"
import { fetchUser, RootState, postUser } from "../../store"
import { useThunk } from "../../hooks/use-thunk"
import { SingleAccordItem } from "../../components/accordItem/MultipleAccordItem"

export default function Home() {
  const [doFetchUser, isLoadingUser, errorUser] = useThunk(fetchUser) // nosso hook
  const [doPostUser, isLoadingCreateUser, errorUserCreate] = useThunk(postUser)
  const { data, } = useSelector((state: RootState) => state.users)



  useEffect(() => {
    doFetchUser() // aqui chamo a funcao que criamos la nosso hook e  ela instancia no createAsyncThunk
  }, [])

  if (errorUser) {
    return <Text fontSize='md'>Something wrong fetch data </Text>
  }

  if (errorUserCreate) {
    return <Text>Something wrong create users</Text>
  }

  const handleAddUser = () => doPostUser()



  return (
    <Stack h="100vh" w="100vw" p="7"  >
      <HStack justify="space-between" >
        <Text>Users</Text>
        <Button alignSelf="flex-end" disabled={isLoadingCreateUser} onClick={handleAddUser} >
          {isLoadingCreateUser ?
            <Spinner />
            :
            <Text> Add Users </Text>
          }

        </Button>
      </HStack>
      <Accordion allowMultiple  >
        <Skeleton isLoaded={!isLoadingUser}>
          <Stack spacing="3" >

            {data.map(it =>
              <SingleAccordItem key={it.id} data={it} />
            )}
          </Stack>
        </Skeleton>
      </Accordion>
    </Stack>

  )
}



```


##
- Outra possibilidade e trabalhar usando Redux Toolkit Query
- Com ele conseguimos cachear nossos dados e quem administra caso esteja obseleto ou não é próprio redux
- Redux usa o reducerPath como chave para se identificar das outras chamadas
- Para garantir que não haverá erro de digitação pode usar assinatura abaixo que e com array
- Com tags determinamos quando atualizar manualmente, quando acontece um mutation
- Reapara na abordagem o valor que recebo no argumento da query e mesmo que temos no invalidateTags e providersTags
- Resumindo o results do invalidateTags ou providersTags é o retorno caso a requisição seja sucesso e o último argumento e o passado na query
- Para typescript preciso dizer o tipo do tagTypes


```typescript
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


export { albumApi }
export const { useFetchAlbumQuery, useAddAlbumMutation, useRemoveAlbumMutation } = albumApi


// aqui conectamos
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


// depois e so chamar o hooks
const { isLoading: isLoadingAlbumQuery, data: dataAlbumQuery, error: errorAlbumQuery } = useFetchAlbumQuery(data)



```
##
- Cuidados que precisa tomar 
- Caso deseja realizar um filtro não pode simplesmente filtrar a lista, pois sera a referência do nosso arrray para alterar de fato, além de realizar o filtro precisamos dizer que o data sera a lista filtrada, como exemplo abaixo
- Com state.data garanto que sera atualizado

```typescript


initialState: {
    data: [] as UsersModel[],
    error: null,
    loading: false,
  },


 builder.addCase(deleteUser.fulfilled, (state, action: PayloadAction<UsersModel>) => {
      state.loading = false
      //eu não posso apenas chamar o filter,preciso dizer que o state.data vai ser igual a lista filtrada para atualizar em tempo real
      //apenas modificando ela não ira refletir na ui
      state.data = state.data.filter(it => it.id !== action.payload.id)
    })
    builder.addCase(deleteUser.rejected, (state) => {
      state.loading = false
    })



```





