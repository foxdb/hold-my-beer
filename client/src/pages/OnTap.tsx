import * as React from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

import { makeStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Toolbar from '@material-ui/core/Toolbar'

import Copyright from '../components/Copyright'
import BreadcrumbsNavigation from '../components/BreadcrumbsNavigation'
import Emoji from '../components/Emoji'

const laJcdvImage = require('../public/la-jcdv.jpg')

interface Beer {
  tapNumber: number
  name: string
  style: string
  abvPercent: number
  brewDate: string
  description: string
  brewersfriendLink?: string
  img?: any
  projectName?: string
  pictureLink?: string
  comingSoon?: boolean
}

const beersOnTap: Beer[] = [
  {
    tapNumber: 2,
    name: 'Zombie Dust',
    abvPercent: 6,
    style: 'American IPA',
    brewDate: '28/05/2020',
    brewersfriendLink:
      'https://www.brewersfriend.com/homebrew/brewsession/338880',
    // projectName: null,
    description:
      "IPA with lots of Citra hops. Two weeks of primary fermentation, including a week of dry-hopping. Wasn't not meant to be hazy but wasn't meant to not be hazy."
  },
  {
    comingSoon: true,
    tapNumber: 0,
    name: 'La JCDV',
    abvPercent: 7,
    style: 'Belgian Blonde Ale',
    img: laJcdvImage,
    brewDate: '13/06/2020',
    brewersfriendLink:
      'https://www.brewersfriend.com/homebrew/brewsession/342497',
    projectName: '2020-06-13-la-jcdv',
    description:
      'Imagine a Venn diagram. On the left, Belgium. On the right, Melbourne. The intersection? La Jean-Claude De Victoria!'
  }
]

const useStyles = makeStyles(theme => ({
  title: {
    fontSize: 18,
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
    minWidth: 300
  },
  cardMedia: {
    // paddingTop: '56.25%' // 16:9
    alignContent: 'center',
    textAlign: 'center'
  },
  cardContent: {
    flexGrow: 1
  },
  pos: {
    marginBottom: 12
  }
}))

export default function Dashboard() {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar)}>
        <Toolbar className={classes.toolbar}>
          <BreadcrumbsNavigation
            current={{ title: 'On tap', link: '/ontap' }}
          />
        </Toolbar>
      </AppBar>
      <main className={classes.content}>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="textPrimary"
              gutterBottom
            >
              Now on tap
            </Typography>
            <Typography
              variant="h5"
              align="center"
              color="textSecondary"
              paragraph
            >
              Get that up ya!
            </Typography>
            {/* <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <Button variant="contained" color="primary">
                    Main call to action
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary">
                    Secondary action
                  </Button>
                </Grid>
              </Grid>
            </div> */}
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}>
            {beersOnTap.map(beer => (
              <Grid item key={beer.tapNumber} xs={12} sm={6} md={4}>
                <Card className={classes.card}>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    align="center"
                    variant="overline"
                    component="h2"
                  >
                    {beer.comingSoon
                      ? `Coming soon`
                      : `Tap ${beer.tapNumber} - ${beer.style}`}
                  </Typography>
                  <CardMedia
                    className={classes.cardMedia}
                    // image="https://source.unsplash.com/random"
                    image={beer.img}
                    title="Image title"
                  >
                    {!beer.img && <Emoji symbol="🍺" />}
                    {beer.img && <img src={beer.img} />}
                  </CardMedia>
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {beer.name}
                    </Typography>

                    <Typography gutterBottom style={{ textAlign: 'justify' }}>
                      {beer.description}
                    </Typography>
                    <Typography className={classes.pos} color="textSecondary">
                      {`Brew date: ${beer.brewDate}`}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      disabled={!beer.projectName}
                    >
                      {beer.projectName ? (
                        <Link
                          to={
                            beer.projectName
                              ? '/projects/' + beer.projectName
                              : '/ontap'
                          }
                        >
                          Data
                        </Link>
                      ) : (
                        'Data'
                      )}
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      disabled={!beer.brewersfriendLink}
                    >
                      {beer.brewersfriendLink ? (
                        <a href={beer.brewersfriendLink}>Brew session</a>
                      ) : (
                        'Brew session'
                      )}
                    </Button>
                  </CardActions>
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
