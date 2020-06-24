import * as React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'

import Dashboard from './pages/Dashboard'
import OnTap from './pages/OnTap'
import Home from './pages/Home'

interface Props {
  name: string
}

const App = (props: Props) => {
  return (
    <div>
      <Router>
        <Switch>
          <Route path="/projects/:name?" component={Dashboard} />
          <Route path="/ontap/" component={OnTap} />
          <Route path="/" component={Home} />
          <Route render={() => <Redirect to="/" />} />
        </Switch>
      </Router>
    </div>
  )
}

export default App
