import { Global } from '@emotion/react'

export default () => (
  <Global
    styles={(theme) => ({
      '*': {
        boxSizing: 'border-box',
        padding: '0px',
        margin: '0px',
        outline: 'none',
      },
    })}
  />
)