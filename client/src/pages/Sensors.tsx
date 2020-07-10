import * as React from 'react'
import clsx from 'clsx'
import moment = require('moment')

import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Toolbar from '@material-ui/core/Toolbar'

import Copyright from '../components/Copyright'
import BreadcrumbsNavigation from '../components/BreadcrumbsNavigation'

import { roundAndFormat } from '../lib/numbers'
import { getSensors, Sensor } from '../lib/api'

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: 14,
    fontWeight: 600,
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    paddingLeft: theme.spacing(1)
  },
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
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
    marginTop: 20
  },
  heroButtons: {
    marginTop: theme.spacing(4)
  },
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8)
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 500
  },
  cardMedia: {
    // paddingTop: '56.25%' // 16:9
    alignContent: 'center',
    textAlign: 'center'
  },
  cardContent: {
    flexGrow: 1
  },
  depositContext: {
    flex: 1
  },
  pos: {
    marginBottom: 20
  }
}))

export default function Sensors() {
  const classes = useStyles()

  const [sensors, setSensors] = React.useState<Sensor[]>([])

  const loadSensors = async () => {
    const sensors = await getSensors()
    setSensors(sensors)
  }

  React.useEffect(() => {
    loadSensors()
  }, [])

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar)}>
        <Toolbar className={classes.toolbar}>
          <BreadcrumbsNavigation
            current={{ title: 'Sensors', link: '/sensors' }}
          />
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Sensors
            </Typography>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {sensors.map(sensor => (
              <Grid item key={sensor.id} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    align="center"
                    variant="overline"
                    component="h4"
                  >
                    {`${sensor.name || 'unnamed'} - ${sensor.type ||
                      'unknown'}`}
                  </Typography>
                  <CardContent className={classes.cardContent}>
                    <Grid container spacing={1}>
                      <Grid item xs={8} md={8} lg={8}>
                        <Typography component="p" variant="h6">
                          {`${roundAndFormat(sensor.readings[0].value, 2)} ${
                            sensor.readings[0].unit
                          }`}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="overline"
                          className={classes.depositContext}
                        >
                          {`${sensor.readings[0].type} - ${moment(
                            sensor.readings[0].createdAt
                          ).format('MMMM DD HH:mm')}`}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={12} lg={12}>
                        <Typography component="p" variant="h6">
                          {`${sensor.id}`}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="overline"
                          className={classes.depositContext}
                        >
                          {`id`}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={12} lg={12}>
                        <Typography component="p" variant="h6">
                          {sensor.externalId}
                        </Typography>
                        <Typography
                          color="textSecondary"
                          variant="overline"
                          className={classes.depositContext}
                        >
                          {`external Id`}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                  {/* <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      disabled={!sensor.projectName}
                    >
                      {sensor.projectName ? (
                        <Link
                          to={
                            sensor.projectName
                              ? '/projects/' + sensor.projectName
                              : '/ontap'
                          }
                        >
                          Brew Data
                        </Link>
                      ) : (
                        'Brew Data'
                      )}
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      disabled={!sensor.brewersfriendLink}
                    >
                      {sensor.brewersfriendLink ? (
                        <a href={sensor.brewersfriendLink}>Brew session</a>
                      ) : (
                        'Brew session'
                      )}
                    </Button>
                  </CardActions> */}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
        <Copyright />
      </main>
    </div>
  )
}
