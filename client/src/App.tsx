import * as React from 'react'
import Home from './pages/Home'

interface Props {
  name: string
}

const App = (props: Props) => {
  return (
    <div
      style={{
        backgroundColor: '#eeeeee',
      }}
    >
      <Home name="Ben" />
    </div>
  )
}

export default App
