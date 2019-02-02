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
        paddingTop: 30,
        paddingBottom: 30
      }}
    >
      <Home />
    </div>
  )
}

export default App
