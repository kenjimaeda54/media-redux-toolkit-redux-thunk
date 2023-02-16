



import { extendTheme } from "@chakra-ui/react"


const fonts = {

  body: 'Roboto, sans-serif',
  heading: 'Roboto, sans-serif',
  monospace: 'Roboto, sans-serif',

}

const colors = {
  text: {
    100: '#00f'
  }
}

export const theme = extendTheme({ colors, fonts })


