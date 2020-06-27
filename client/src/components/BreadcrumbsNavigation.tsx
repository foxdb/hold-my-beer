import * as React from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumbs } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import NavigateNextIcon from '@material-ui/icons/NavigateNext'
const useStyles = makeStyles(theme => ({
  barTitle: {
    flexGrow: 1
  }
}))

interface Props {
  current?: {
    link: string
    title: string
  }
}

export default function BreadcrumbsNavigation(props: Props) {
  const classes = useStyles()

  return (
    <Breadcrumbs
      color="inherit"
      separator={
        <NavigateNextIcon fontSize="small" style={{ color: 'white' }} />
      }
      aria-label="breadcrumb"
    >
      <Link style={{ color: 'white' }} to="/">
        <Typography
          component="h2"
          variant="h6"
          color="inherit"
          noWrap
          className={classes.barTitle}
        >
          {`Hold my Beer`}
        </Typography>
      </Link>
      {props.current && (
        <Link style={{ color: 'white' }} to={props.current.title}>
          <Typography
            component="h2"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.barTitle}
          >
            {props.current.title}
          </Typography>
        </Link>
      )}
    </Breadcrumbs>
  )
}
