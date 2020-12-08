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
import Fab from '@material-ui/core/Fab';

import Copyright from '../components/Copyright'
import BreadcrumbsNavigation from '../components/BreadcrumbsNavigation'
import Emoji from '../components/Emoji'

import { roundAndFormat } from '../lib/numbers'

// const laJcdvImage = require('../public/la-jcdv.jpg')
// const pitStopImage = require('../public/pitstop.jpg')
// const pitViperImage = require('../public/cobrakai.jpeg')
const goldenAyeImage = require('../public/goldeneye.jpeg')
const lactoImage = require('../public/lactoplantarum.jpeg')
// const winterAleImage = require('../public/winterAle.jpg')

interface Beer {
  tapLocation: string
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
  allGone?: boolean
}

const beersOnTap: Beer[] = [
  {
    // comingSoon: true,
    tapLocation: 'Left',
    name: 'Pitt\'s Best Bitter',
    abvPercent: 5,
    style: 'Best Bitter',
    // img: pitViperImage,
    brewDate: '17/10/2020',
    brewersfriendLink:
      'https://www.brewersfriend.com/homebrew/brewsession/360784',
    // projectName: null,
    description: ""
  },
  {
    // comingSoon: true,
    tapLocation: 'Middle',
    name: 'Golden Aye',
    abvPercent: 4.8,
    style: 'British Golden Ale',
    img: goldenAyeImage,
    brewDate: '01/11/2020',
    brewersfriendLink:
      'https://www.brewersfriend.com/homebrew/brewsession/361863',
    projectName: 'golden-aye',
    description:
      'British yeast, british malt, british hops,... Fancy a cuppa?'
  },
  {
    comingSoon: true,
    tapLocation: 'Right',
    name: 'Süß und sauer',
    abvPercent: 4,
    style: 'Berliner Weisse',
    img: lactoImage,
    brewDate: '17/11/2020',
    brewersfriendLink:
      'https://www.brewersfriend.com/homebrew/brewsession/364382',
    // projectName: null,
    description: "Kettle soured Berliner Weisse."
  },
  // {
  //   // comingSoon: true,
  //   tapLocation: 'Left',
  //   name: 'Pitt Viper IPA',
  //   abvPercent: 6.2,
  //   style: 'IPA',
  //   img: pitViperImage,
  //   brewDate: '12/09/2020',
  //   brewersfriendLink:
  //     'https://www.brewersfriend.com/homebrew/brewsession/355929',
  //   // projectName: null,
  //   description: "'Cause it bites."
  // },
  // {
  //   // comingSoon: true,
  //   tapLocation: 'Middle',
  //   name: 'Pitt Stop Pale Ale',
  //   abvPercent: 5.1,
  //   style: 'Pale Ale',
  //   img: pitStopImage,
  //   brewDate: '04/09/2020',
  //   brewersfriendLink:
  //     'https://www.brewersfriend.com/homebrew/brewsession/354514',
  //   projectName: '2020-09-04-pitt-stop-pale-ale',
  //   description:
  //     'A simple pale ale. Showcasing Galaxy, Citra (DH) and Centennial (DH) hops. Simple grain bill: Pilsner malt and CaraAmber. Fermented with English Ale yeast . It took its time!'
  // }
  // {
  //   // comingSoon: true,
  //   allGone: true,
  //   tapLocation: 'Left',
  //   name: 'La JCDV',
  //   abvPercent: 7.2,
  //   style: 'Belgian Blonde Ale',
  //   img: laJcdvImage,
  //   brewDate: '13/06/2020',
  //   brewersfriendLink:
  //     'https://www.brewersfriend.com/homebrew/brewsession/342497',
  //   projectName: '2020-06-13-la-jcdv',
  //   description:
  //     'Imagine a Venn diagram. On the left, Belgium. On the right, Melbourne. The intersection? La Jean-Claude De Victoria!'
  // },
  // {
  //   // comingSoon: true,
  //   tapLocation: 'Middle',
  //   name: 'Christmas in July',
  //   abvPercent: 5.5,
  //   style: 'Winter Ale',
  //   img: winterAleImage,
  //   brewDate: '19/07/2020',
  //   brewersfriendLink:
  //     'https://www.brewersfriend.com/homebrew/brewsession/346111',
  //   projectName: '2020-07-19-winter',
  //   description:
  //     'Hopefully a nice spiced amber ale to warm spirits during the cold Melbourne winter!'
  // },
  // {
  //   allGone: true,
  //   tapLocation: 'Middle',
  //   name: 'Zombie Dust',
  //   abvPercent: 6,
  //   style: 'American IPA',
  //   brewDate: '28/05/2020',
  //   brewersfriendLink:
  //     'https://www.brewersfriend.com/homebrew/brewsession/338880',
  //   // projectName: null,
  //   description:
  //     "IPA with lots of Citra hops. Two weeks of primary fermentation, including a week of dry-hopping. Wasn't not meant to be hazy but wasn't meant to not be hazy."
  // }
]

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
  depositContext: {
    flex: 1
  },
  pos: {
    marginBottom: 20
  },
  feedbackButton: {
    margin: 0,
    top: 'auto',
    right: 20,
    bottom: 20,
    left: 'auto',
    position: 'fixed',
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
      <Fab variant="extended" color="secondary" aria-label="add" className={classes.feedbackButton}>
        <a href='https://forms.gle/nR57QE9JC2rZ6DRV8' target='_blank'>Feedback</a>
      </Fab>
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
            {beersOnTap
              .filter(beer => !beer.allGone && !beer.comingSoon)
              .map(beer => (
                <Grid item key={beer.tapLocation} xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      align="center"
                      variant="overline"
                      component="h4"
                    >
                      {beer.comingSoon
                        ? `Coming soon`
                        : `${beer.tapLocation} Tap - ${beer.style}`}
                    </Typography>
                    <CardMedia
                      className={classes.cardMedia}
                      // image="https://source.unsplash.com/random"
                      // image={beer.img}
                      title="Image title"
                    >
                      {!beer.img && <Emoji symbol="🍺" />}
                      {beer.img && <img src={beer.img} />}
                    </CardMedia>
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {beer.name}
                      </Typography>

                      <Typography
                        gutterBottom
                        className={classes.pos}
                        style={{ textAlign: 'justify' }}
                      >
                        {beer.description}
                      </Typography>

                      <Grid container spacing={1}>
                        <Grid item xs={6} md={6} lg={6}>
                          <Typography component="p" variant="h6">
                            {`${roundAndFormat(beer.abvPercent, 1)} %`}
                          </Typography>
                          <Typography
                            color="textSecondary"
                            variant="overline"
                            className={classes.depositContext}
                          >
                            {`ABV`}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} md={6} lg={6}>
                          <Typography component="p" variant="h6">
                            {beer.brewDate}
                          </Typography>
                          <Typography
                            color="textSecondary"
                            variant="overline"
                            className={classes.depositContext}
                          >
                            {`Brew date`}
                          </Typography>
                        </Grid>
                      </Grid>
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
                            Brew Data
                          </Link>
                        ) : (
                          'Brew Data'
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
            {beersOnTap
              .filter(beer => beer.allGone || beer.comingSoon)
              .map(beer => (
                <Grid item key={beer.tapLocation} xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    <Typography
                      className={classes.title}
                      color="textSecondary"
                      align="center"
                      variant="overline"
                      component="h4"
                    >
                      {beer.comingSoon ? `Coming soon` : `All Gone!`}
                    </Typography>
                    <CardMedia
                      className={classes.cardMedia}
                      // image="https://source.unsplash.com/random"
                      // image={beer.img}
                      title="Image title"
                    >
                      {!beer.img && <Emoji symbol="🍺" />}
                      {beer.img && <img src={beer.img} />}
                    </CardMedia>
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2">
                        {beer.name}
                      </Typography>

                      <Typography
                        gutterBottom
                        className={classes.pos}
                        style={{ textAlign: 'justify' }}
                      >
                        {beer.description}
                      </Typography>

                      <Grid container spacing={1}>
                        <Grid item xs={6} md={6} lg={6}>
                          <Typography component="p" variant="h6">
                            {`${roundAndFormat(beer.abvPercent, 1)} %`}
                          </Typography>
                          <Typography
                            color="textSecondary"
                            variant="overline"
                            className={classes.depositContext}
                          >
                            {`ABV`}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} md={6} lg={6}>
                          <Typography component="p" variant="h6">
                            {beer.brewDate}
                          </Typography>
                          <Typography
                            color="textSecondary"
                            variant="overline"
                            className={classes.depositContext}
                          >
                            {`Brew date`}
                          </Typography>
                        </Grid>
                      </Grid>
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
                            Brew Data
                          </Link>
                        ) : (
                          'Brew Data'
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
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <Grid container spacing={4}></Grid>
        </Container>
        <Copyright />
      </main>
    </div>
  )
}
