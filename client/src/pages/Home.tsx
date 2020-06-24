import * as React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Toolbar from '@material-ui/core/Toolbar'

import Copyright from '../components/Copyright'
import { Breadcrumbs } from '@material-ui/core'
import { Link } from 'react-router-dom'
import Title from '../components/Title'

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
  appBarSpacer: theme.mixins.toolbar
}))

export default function Dashboard() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar)}>
        <Toolbar className={classes.toolbar}>
          <Breadcrumbs color="inherit" aria-label="breadcrumb">
            <Link style={{ color: 'white' }} to="/">
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                className={classes.barTitle}
              >
                {`Hold my Beer`}
              </Typography>
            </Link>
          </Breadcrumbs>
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <div className={classes.container}>
          <Container maxWidth="sm">
            <Grid container spacing={4}>
              <Grid item>
                <Link to="/projects">
                  <Title>Metrics</Title>
                </Link>
              </Grid>
              <Grid item>
                <Link to="/ontap">
                  <Title>On tap</Title>
                </Link>
              </Grid>
            </Grid>
          </Container>
        </div>
        <Copyright />
      </main>
    </div>
  )
}
