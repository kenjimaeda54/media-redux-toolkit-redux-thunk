import { Provider } from "react-redux"
import { ChakraProvider } from "@chakra-ui/react"
import Global from './global/global'
import { theme } from './global/theme'
import Home from './pages/home/Home'
import { store } from './store'

function App() {
  return (
    <Provider store={store}>
      <ChakraProvider theme={theme} >
        <Global />
        <Home />
      </ChakraProvider>
    </Provider>
  )
}

export default App
