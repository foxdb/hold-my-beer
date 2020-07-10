import * as React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch
} from 'react-router-dom'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import Dashboard from './pages/Dashboard'
import OnTap from './pages/OnTap'
import Home from './pages/Home'
import Sensors from './pages/Sensors'
import { colors } from './style'

interface Props {
  name: string
}

// https://fontpair.co/pairing/biorhyme-and-spacemono

const theme = createMuiTheme({
  palette: {
    // type: 'dark',
    // text: {
    //   primary: colors.textOnPrimary
    // },
    primary: {
      main: colors.primary
      // light: colors.primaryLight,
      // dark: colors.primaryDark,
      // contrastText: colors.textOnPrimary
    },
    secondary: {
      main: colors.primary
    },
    background: {
      // default: '#000000',
      // paper: '#212121'
    }
  },
  // / font-family: 'Space Mono', monospace;
  typography: {
    h1: {
      fontFamily: `"BioRhyme", serif, "Roboto", "Helvetica", "Arial", sans-serif`
    },
    h2: {
      fontFamily: `"BioRhyme", serif, "Roboto", "Helvetica", "Arial", sans-serif`
    },
    h3: {
      fontFamily: `"BioRhyme", serif, "Roboto", "Helvetica", "Arial", sans-serif`
    },
    h4: {
      fontFamily: `"BioRhyme", serif, "Roboto", "Helvetica", "Arial", sans-serif`
    },
    h5: {
      fontFamily: `"BioRhyme", serif, "Roboto", "Helvetica", "Arial", sans-serif`
    },
    h6: {
      fontFamily: `"BioRhyme", serif, "Roboto", "Helvetica", "Arial", sans-serif`
    },
    fontFamily: `'Space Mono', monospace, "Roboto", "Helvetica", "Arial", sans-serif`
  }
})

const App = (props: Props) => {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Router>
          <Switch>
            <Route path="/projects/:name?" component={Dashboard} />
            <Route path="/ontap/" component={OnTap} />
            <Route path="/sensors/" component={Sensors} />
            <Route path="/" component={Home} />
            <Route render={() => <Redirect to="/" />} />
          </Switch>
        </Router>
      </ThemeProvider>
    </div>
  )
}

export default App
