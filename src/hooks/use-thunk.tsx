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
