import * as React from 'react'
import Home from './pages/Home'

interface Props {
  name: string
}

const App = (props: Props) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#eeeeee',
      }}
    >
      <Home name="Ben" />
    </div>
  )
}

export default App
