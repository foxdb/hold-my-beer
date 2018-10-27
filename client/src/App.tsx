import * as React from 'react'
import Home from './pages/Home'

interface Props {
  name: string
}

const App = (props: Props) => {
  return <Home name="Ben" />
}

export default App
