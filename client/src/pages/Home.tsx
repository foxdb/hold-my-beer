import * as React from 'react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Toolbar from '@material-ui/core/Toolbar'

import { colors } from '../style'

import Copyright from '../components/Copyright'
import BreadcrumbsNavigation from '../components/BreadcrumbsNavigation'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  barTitle: {
    flexGrow: 1
  },
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  appBarSpacer: theme.mixins.toolbar,
  gridMenuItem: {
    backgroundColor: colors.primary,
    width: 150,
    height: 100,
    margin: 2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuItem: { color: 'white', fontWeight: 'bold', textDecoration: 'underline' }
}))

export default function Dashboard() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar)}>
        <Toolbar className={classes.toolbar}>
          <BreadcrumbsNavigation />
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <div className={classes.container}>
          <Container>
            <Grid
              container
              spacing={4}
              alignContent="center"
              alignItems="center"
              justify="center"
            >
              <Link to="/projects">
                <Grid item className={classes.gridMenuItem}>
                  <Typography
                    component="h2"
                    variant="button"
                    className={classes.menuItem}
                    gutterBottom
                  >
                    Projects
                  </Typography>
                </Grid>
              </Link>
              <Link to="/ontap">
                <Grid item className={classes.gridMenuItem}>
                  <Typography
                    component="h2"
                    variant="button"
                    className={classes.menuItem}
                    gutterBottom
                  >
                    On tap
                  </Typography>
                </Grid>
              </Link>
            </Grid>
          </Container>
        </div>
        <Copyright />
      </main>
    </div>
  )
}
