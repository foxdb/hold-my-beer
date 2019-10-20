import * as React from 'react'
import Dashboard from './pages/Dashboard'

interface Props {
  name: string
}

const App = (props: Props) => {
  return (
    <div>
      <Dashboard />
    </div>
  )
}

export default App
