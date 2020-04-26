import * as React from 'react'
import clsx from 'clsx'
import { makeStyles, fade } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

// import Drawer from '@material-ui/core/Drawer'

import AppBar from '@material-ui/core/AppBar'

import Toolbar from '@material-ui/core/Toolbar'
// import List from '@material-ui/core/List'
import Typography from '@material-ui/core/Typography'
// import Divider from '@material-ui/core/Divider'
// import IconButton from '@material-ui/core/IconButton'
// import Badge from '@material-ui/core/Badge'
import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
// import MenuIcon from '@material-ui/icons/Menu'
// import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'

import LastHoursChart from '../components/LastHoursChart'
import GravityChart from '../components/GravityChart'
import Copyright from '../components/Copyright'
import OverallChart from '../components/OverallChart'

import { getProjects, getProject } from '../lib/api'

import ProjectSelector from '../components/ProjectSelector'
// import InputBase from '@material-ui/core/InputBase'
// import NotificationsIcon from '@material-ui/icons/Notifications'
// import { mainListItems, secondaryListItems } from './listItems'
// import Chart from './Chart'
import LatestValues from '../components/LatestValues'
// import Orders from './Orders'

const drawerWidth = 240

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  fixedHeight: {
    height: 250
  },
  doubleHeight: {
    height: 500
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: 'none'
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  inputRoot: {
    color: 'inherit'
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9)
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto'
    }
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
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
  }
}))

export default function Dashboard() {
  const classes = useStyles()

  const [open] = React.useState(false)

  const [availableProjects, setAvailableProjects] = React.useState<
    string[] | null
  >([])
  const [extTempLogFile, setExtTempLogFile] = React.useState<string | null>(
    null
  )
  // const [internalTempLogFile, setInternalTempLogFile] = React.useState<
  //   string | null
  // >(null)

  const [gravityLogFile, setGravityLogFile] = React.useState<string | null>(
    null
  )
  // const [eventsLogFile, setEventsLogFile] = React.useState<string | null>(null)

  const [selectedProject, setSelectedProject] = React.useState<string | null>(
    null
  )

  const loadLogFiles = async () => {
    const projects = await getProjects()
    setAvailableProjects(projects)

    if (selectedProject === null) {
      setSelectedProject(projects[0])
    }
  }

  React.useEffect(() => {
    loadLogFiles()
  }, [])

  React.useEffect(() => {
    if (selectedProject !== null) {
      getProject(selectedProject).then(project => {
        const projectExtTempLog = project.logs.find(
          log =>
            log.includes('external-temperature') ||
            (log.includes('temperature') &&
              !log.includes('internal-temperature'))
        )
        if (projectExtTempLog) {
          console.log(`Found external temp log: ${projectExtTempLog}`)
          setExtTempLogFile(projectExtTempLog)
        } else {
          setExtTempLogFile(null)
        }

        // const projectInternalTemp = project.logs.find(log =>
        //   log.includes('internal-temperature')
        // )
        // if (projectInternalTemp) {
        //   console.log(`Found internal temp log: ${projectInternalTemp}
        //   `)
        //   setInternalTempLogFile(projectInternalTemp)
        // } else {
        //   setInternalTempLogFile(null)
        // }

        const projectGravity = project.logs.find(log => log.includes('gravity'))
        if (projectGravity) {
          setGravityLogFile(projectGravity)
          console.log(`Found gravity log: ${projectGravity}
          `)
        } else {
          setGravityLogFile(null)
        }

        // const projectEvents = project.logs.find(log => log.includes('events'))
        // if (projectEvents) {
        //   console.log(`Found events log: ${projectEvents}
        //   `)
        //   setEventsLogFile(projectEvents)
        // } else {
        //   setEventsLogFile(null)
        // }
      })
    }
  }, [selectedProject])

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight)
  const doubleHeightPaper = clsx(classes.paper, classes.doubleHeight)

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="absolute"
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          {/* <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton> */}
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            Hold my Beer
          </Typography>
          <ProjectSelector
            projects={availableProjects}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
          />
        </Toolbar>
      </AppBar>
      {/* <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
        }}
        open={open}
        >
        <div className={classes.toolbarIcon}>
        <IconButton onClick={handleDrawerClose}>
        <ChevronLeftIcon />
        </IconButton>
        </div>
        <Divider />
        {<List>{mainListItems}</List>}
        <Divider />
        {<List>{secondaryListItems}</List>}
      </Drawer> */}
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                {extTempLogFile && (
                  <LatestValues
                    tempLogFileName={extTempLogFile}
                    gravityLogFileName={gravityLogFile}
                  />
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>
                {extTempLogFile && (
                  <LastHoursChart logFileName={extTempLogFile} />
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <Paper className={doubleHeightPaper}>
                {gravityLogFile && (
                  <GravityChart logFileName={gravityLogFile} />
                )}
              </Paper>
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
              <Paper className={doubleHeightPaper}>
                {extTempLogFile && (
                  <OverallChart logFileName={extTempLogFile} />
                )}
              </Paper>
            </Grid>
            {/* <Grid item xs={12} md={12} lg={12}>
              <Paper className={classes.paper}>
                {extTempLogFile && (
                  <LastHoursChart logFileName={extTempLogFile} />
                )}
              </Paper>
            </Grid> */}
            {/* Chart */}
            {/* <Grid item xs={12} md={8} lg={9}>
              <Paper className={fixedHeightPaper}>{<Chart />}</Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.paper}>{<Orders />}</Paper>
            </Grid> */}
          </Grid>
        </Container>
        <Copyright />
      </main>
    </div>
  )
}
